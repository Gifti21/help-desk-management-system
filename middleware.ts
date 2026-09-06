import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for Help Desk Management System
 * Enforces role-based access control at the route level
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block test endpoints in production
  if (
    process.env.NODE_ENV !== "development" &&
    (pathname.startsWith("/api/test/") ||
      ["/api/test-login", "/api/test-signin", "/api/test-user"].includes(
        pathname,
      ))
  ) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Role-based route protection is handled by individual route handlers
  // using the getSessionUser() and requireRole() functions from lib/rbac.ts
  // This keeps the middleware lightweight and allows for more granular control

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/test/:path*",
    "/api/test-login",
    "/api/test-signin",
    "/api/test-user",
    "/api/admin/:path*",
    "/api/agent/:path*",
    "/api/employee/:path*",
  ],
};
