import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { developmentOnly } from "@/lib/development-only";

/**
 * Test endpoint to check if a user exists and verify password
 */
export async function POST(request: NextRequest) {
  const blocked = developmentOnly();
  if (blocked) return blocked;
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("[CHECK USER] Looking for email:", email);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        passwordHash: true,
        departmentId: true,
      },
    });

    if (!user) {
      return NextResponse.json({
        found: false,
        message: "User not found in database",
      });
    }

    // Test password
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    return NextResponse.json({
      found: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        departmentId: user.departmentId,
      },
      passwordMatches,
      passwordHashPrefix: user.passwordHash.substring(0, 10) + "...",
    });
  } catch (error) {
    console.error("[CHECK USER] Error:", error);
    return NextResponse.json(
      { error: "Failed to check user", details: String(error) },
      { status: 500 },
    );
  }
}
