import { SessionUser } from "@/src/infrastructure/authentication/session";
import { ForbiddenError } from "@/src/shared/errors/AppError";

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
        return true;
    }
    if (user.role === "EMPLOYEE") {
        return ticket.requesterId === user.id;
    }
    if (user.role === "AGENT") {
        return ticket.assigneeId === user.id;
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
        return true;
    }
    if (user.role === "AGENT") {
        return ticket.assigneeId === user.id;
    }
    return false;
}

/**
 * Check if user can delete a ticket
 */
export function canDeleteTicket(user: SessionUser): boolean {
    return user.role === "ADMIN";
}

/**
 * Check if user can assign tickets
 */
export function canAssignTicket(user: SessionUser): boolean {
    return user.role === "ADMIN";
}

/**
 * Check if user can create ticket for others
 */
export function canCreateTicketForOthers(user: SessionUser): boolean {
    return user.role === "ADMIN";
}

/**
 * Enforce permission - throws if not allowed
 */
export function enforcePermission(allowed: boolean, message?: string): void {
    if (!allowed) {
        throw new ForbiddenError(message || "Access denied");
    }
}
