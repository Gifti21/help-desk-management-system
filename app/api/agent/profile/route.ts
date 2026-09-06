import { NextRequest, NextResponse } from "next/server";
import { createSession, getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "AGENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, firstName: true, lastName: true },
  });

  return profile
    ? NextResponse.json({ success: true, data: profile })
    : NextResponse.json({ error: "Profile not found" }, { status: 404 });
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "AGENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const validation = profileSchema.safeParse(await request.json());
  if (!validation.success) {
    return NextResponse.json(
      { error: "Invalid profile data" },
      { status: 400 },
    );
  }

  const data = validation.data;
  const duplicate = await prisma.user.findFirst({
    where: { email: data.email.toLowerCase(), id: { not: user.id } },
  });
  if (duplicate) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 },
    );
  }

  const profile = await prisma.user.update({
    where: { id: user.id },
    data: { ...data, email: data.email.toLowerCase() },
    select: { id: true, email: true, firstName: true, lastName: true },
  });

  await createSession({ ...user, ...profile });
  return NextResponse.json({ success: true, data: profile });
}
