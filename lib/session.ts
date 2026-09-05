import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import { createHmac, timingSafeEqual } from "node:crypto";

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

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be configured in production");
  }
  return "development-only-session-secret";
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("base64url");
}

function encodeSession(user: SessionUser): string {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeSession(value: string): SessionUser | null {
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = sign(payload);
  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected)
  ) {
    return null;
  }

  try {
    const user = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as SessionUser;
    if (!user.id || !user.email || !user.role || !user.departmentId)
      return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Create a session for a user that has already been authenticated.
 */
export async function createSession(user: SessionUser): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, encodeSession(user), {
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
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return null;
  }

  if (!user.isActive) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) return null;

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role as "ADMIN" | "AGENT" | "EMPLOYEE",
    departmentId: user.departmentId,
  };

  await createSession(sessionUser);
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

  const sessionUser = decodeSession(sessionCookie.value);
  if (!sessionUser) return null;

  const currentUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      departmentId: true,
      isActive: true,
    },
  });

  if (!currentUser || !currentUser.isActive) return null;

  return {
    id: currentUser.id,
    email: currentUser.email,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    role: currentUser.role,
    departmentId: currentUser.departmentId,
  };
}

export async function requireSession(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export function hasRole(
  user: SessionUser,
  ...roles: SessionUser["role"][]
): boolean {
  return roles.includes(user.role);
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
