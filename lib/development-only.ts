import { NextResponse } from "next/server";

export function rejectOutsideDevelopment() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return null;
}
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
