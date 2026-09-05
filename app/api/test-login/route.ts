import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { developmentOnly } from "@/lib/development-only";

export async function POST(request: NextRequest) {
  const blocked = developmentOnly();
  if (blocked) return blocked;
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("[TEST-LOGIN] Testing login for:", email);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    console.log("[TEST-LOGIN] User found:", !!user);

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not found",
        debug: { email: email.toLowerCase() },
      });
    }

    console.log("[TEST-LOGIN] User active:", user.isActive);
    console.log("[TEST-LOGIN] User role:", user.role);

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    console.log("[TEST-LOGIN] Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: "Invalid password",
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("[TEST-LOGIN] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
