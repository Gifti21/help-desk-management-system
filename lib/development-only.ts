import { NextResponse } from "next/server";

export function developmentOnly(): NextResponse | null {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is disabled in production" },
      { status: 404 },
    );
  }

  return null;
}
