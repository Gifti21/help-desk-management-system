/**
 * Simple session management using cookies
 * Temporary solution until NextAuth v5 migration
 */

import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "AGENT" | "EMPLOYEE";
  departmentId: string;
}

const SESSION_COOKIE_NAME = "helpdesk-session";
const SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Create a session for a user that has already been authenticated.
 */
export async function createSession(user: SessionUser): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_EXPIRY / 1000,
    path: "/",
  });
}

/**
 * Login user and create session
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<SessionUser | null> {
  console.log("[SESSION] ========== LOGIN ATTEMPT ==========");
  console.log("[SESSION] Email:", email);
  console.log("[SESSION] Password length:", password.length);

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  console.log("[SESSION] User found in DB:", !!user);
  if (user) {
    console.log("[SESSION] User details:", {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      hasPasswordHash: !!user.passwordHash,
      passwordHashLength: user.passwordHash?.length,
    });
  }

  if (!user) {
    console.log("[SESSION] ❌ User not found in database");
    return null;
  }

  if (!user.isActive) {
    console.log("[SESSION] ❌ User exists but is INACTIVE");
    return null;
  }

  console.log("[SESSION] Comparing password with hash...");
  console.log(
    "[SESSION] Password hash prefix:",
    user.passwordHash.substring(0, 20),
  );

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  console.log("[SESSION] Password comparison result:", isPasswordValid);

  if (!isPasswordValid) {
    console.log("[SESSION] ❌ Password does NOT match");
    return null;
  }

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role as "ADMIN" | "AGENT" | "EMPLOYEE",
    departmentId: user.departmentId,
  };

  console.log("[SESSION] ✅ Password matches! Creating session...");

  await createSession(sessionUser);

  console.log("[SESSION] ✅ Session created successfully");
  console.log("[SESSION] ========================================");
  return sessionUser;
}

/**
 * Get current session user
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value) as SessionUser;
  } catch {
    return null;
  }
}

/**
 * Logout user and clear session
 */
export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if user has admin role
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getSessionUser();
  return user?.role === "ADMIN";
}
