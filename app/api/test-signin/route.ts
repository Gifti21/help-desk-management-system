import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { developmentOnly } from "@/lib/development-only";

export async function POST(request: Request) {
  const blocked = developmentOnly();
  if (blocked) return blocked;
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("Testing signin for:", email);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { department: true },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not found",
        email: email.toLowerCase().trim(),
      });
    }

    if (!user.isActive) {
      return NextResponse.json({
        success: false,
        error: "User is not active",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        error: "Invalid password",
        passwordProvided: password,
        note: "Password does not match hash",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Login would succeed",
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        departmentId: user.departmentId,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  const blocked = developmentOnly();
  if (blocked) return blocked;
  return NextResponse.json({
    message:
      "POST to this endpoint with { email, password } to test signin logic",
  });
}
