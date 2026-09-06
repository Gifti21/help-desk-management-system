import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "AGENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const validation = passwordSchema.safeParse(await request.json());
  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid password data" },
      { status: 400 },
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { passwordHash: true },
  });
  if (
    !dbUser ||
    !(await bcrypt.compare(
      validation.data.currentPassword,
      dbUser.passwordHash,
    ))
  ) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(validation.data.newPassword, 10) },
  });

  return NextResponse.json({ success: true });
}
