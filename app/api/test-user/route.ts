import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { developmentOnly } from "@/lib/development-only";

export async function GET() {
  const blocked = developmentOnly();
  if (blocked) return blocked;
  try {
    const user = await prisma.user.findUnique({
      where: { email: "admin@helpdesk.com" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" });
    }

    // Test password
    const isValid = await bcrypt.compare("admin123", user.passwordHash);

    return NextResponse.json({
      user: {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        isActive: user.isActive,
      },
      passwordVerified: isValid,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
