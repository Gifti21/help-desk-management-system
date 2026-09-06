import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

const readSchema = z
  .object({
    notificationId: z.string().optional(),
    all: z.boolean().optional(),
  })
  .refine((value) => Boolean(value.notificationId) || value.all === true, {
    message: "Provide notificationId or set all to true",
  });

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const notifications = await prisma.notification.findMany({
    where: { recipientId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      reads: {
        where: { userId: user.id },
        select: { readAt: true },
      },
    },
  });

  const data = notifications.map(({ reads, ...notification }) => ({
    ...notification,
    read: reads.length > 0,
  }));

  return NextResponse.json({
    notifications: data,
    unreadCount: data.filter((notification) => !notification.read).length,
  });
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const validation = readSchema.safeParse(await request.json());
  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Invalid notification read request",
        details: validation.error.issues,
      },
      { status: 400 },
    );
  }

  const { notificationId, all } = validation.data;
  if (notificationId) {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, recipientId: user.id },
      select: { id: true },
    });
    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 },
      );
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    const ids = notificationId
      ? [notificationId]
      : (
          await tx.notification.findMany({
            where: {
              recipientId: user.id,
              reads: { none: { userId: user.id } },
            },
            select: { id: true },
          })
        ).map((notification) => notification.id);

    if (ids.length > 0) {
      await tx.notificationRead.createMany({
        data: ids.map((id) => ({ notificationId: id, userId: user.id })),
        skipDuplicates: true,
      });
    }

    return ids.length;
  });

  return NextResponse.json({
    success: true,
    markedRead: result,
    all: Boolean(all),
  });
}
