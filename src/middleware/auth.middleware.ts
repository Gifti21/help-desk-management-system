import { getSessionUser, SessionUser } from "@/src/infrastructure/authentication/session";
import { UnauthorizedError } from "@/src/shared/errors/AppError";
import { Role } from "@/src/shared/types/auth.types";

/**
 * Get current user and enforce authentication
 */
export async function requireAuth(): Promise<SessionUser> {
    const user = await getSessionUser();
    if (!user) {
        throw new UnauthorizedError("Authentication required");
    }
    return user;
}

/**
 * Require specific role(s)
 */
export function requireRole(user: SessionUser, ...allowedRoles: Role[]): void {
    if (!allowedRoles.includes(user.role)) {
        throw new Error(
            `Access denied. Required role: ${allowedRoles.join(" or ")}`,
        );
    }
}

/**
 * Check if user is admin
 */
export function isAdmin(user: SessionUser): boolean {
    return user.role === "ADMIN";
}

/**
 * Check if user is agent
 */
export function isAgent(user: SessionUser): boolean {
    return user.role === "AGENT";
}

/**
 * Check if user is employee
 */
export function isEmployee(user: SessionUser): boolean {
    return user.role === "EMPLOYEE";
}
