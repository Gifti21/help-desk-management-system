import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = await loginUser(email, password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 },
      );
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
  } catch (error) {
    console.error("[LOGIN API] Error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred during login" },
      { status: 500 },
    );
  }
}
