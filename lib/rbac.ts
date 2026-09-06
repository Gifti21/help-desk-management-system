import { NextResponse } from "next/server";
import { getSessionUser, SessionUser } from "./session";

/**
 * Role-Based Access Control (RBAC) Utilities
 * Enforces strict "own portal only" rules for the Help Desk Management System
 */

export type Role = "ADMIN" | "AGENT" | "EMPLOYEE";

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
        throw new ForbiddenError(
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

/**
 * Custom error classes for better error handling
 */
export class UnauthorizedError extends Error {
    constructor(message: string = "Unauthorized") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export class ForbiddenError extends Error {
    constructor(message: string = "Forbidden") {
        super(message);
        this.name = "ForbiddenError";
    }
}

/**
 * Handle API errors and return appropriate responses
 */
export function handleApiError(error: unknown): NextResponse {
    if (error instanceof UnauthorizedError) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof ForbiddenError) {
        return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("API Error:", error);
    return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
    );
}

/**
 * Build ticket query filters based on user role
 * Implements strict "own portal only" rules
 */
export function getTicketFilterForRole(user: SessionUser): {
    requesterId?: string;
    assigneeId?: string;
} {
    if (user.role === "EMPLOYEE") {
        // EMPLOYEE: Only tickets where requesterId == currentUserId
        return { requesterId: user.id };
    } else if (user.role === "AGENT") {
        // AGENT: Only tickets where assigneeId == currentUserId
        return { assigneeId: user.id };
    }
    // ADMIN: No filter (sees all tickets)
    return {};
}

/**
 * Check if user can view a specific ticket
 */
export function canViewTicket(
    user: SessionUser,
    ticket: { requesterId: string; assigneeId: string | null },
): boolean {
    if (user.role === "ADMIN") {
        return true; // Admin can view all tickets
    }
    if (user.role === "EMPLOYEE") {
        return ticket.requesterId === user.id; // Employee can only view their own tickets
    }
    if (user.role === "AGENT") {
        return ticket.assigneeId === user.id; // Agent can only view assigned tickets
    }
    return false;
}

/**
 * Check if user can update a ticket
 */
export function canUpdateTicket(
    user: SessionUser,
    ticket: { requesterId: string; assigneeId: string | null },
): boolean {
    if (user.role === "ADMIN") {
        return true; // Admin can update any ticket
    }
    if (user.role === "AGENT") {
        return ticket.assigneeId === user.id; // Agent can only update their assigned tickets
    }
    return false; // Employees cannot update tickets
}

/**
 * Check if user can delete a ticket
 */
export function canDeleteTicket(user: SessionUser): boolean {
    return user.role === "ADMIN"; // Only admin can delete tickets
}

/**
 * Check if user can assign tickets
 */
export function canAssignTicket(user: SessionUser): boolean {
    return user.role === "ADMIN"; // Only admin can assign tickets
}

/**
 * Check if user can create ticket for others
 */
export function canCreateTicketForOthers(user: SessionUser): boolean {
    return user.role === "ADMIN"; // Only admin can create tickets for others
}
