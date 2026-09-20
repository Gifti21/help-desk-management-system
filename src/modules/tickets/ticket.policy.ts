import { SessionUser } from "@/src/infrastructure/authentication/session";
import { TicketStatus, Role } from "@prisma/client";

const allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
    OPEN: ["IN_PROGRESS", "RESOLVED", "CLOSED"],
    IN_PROGRESS: ["OPEN", "RESOLVED", "CLOSED"],
    RESOLVED: ["IN_PROGRESS", "CLOSED"],
    CLOSED: ["OPEN"],
};

export class TicketPolicy {
    /**
     * Check if status transition is allowed
     */
    static canTransitionStatus(
        currentStatus: TicketStatus,
        nextStatus: TicketStatus,
        userRole: Role,
    ): boolean {
        if (currentStatus === nextStatus) return true;

        // Only ADMIN can reopen closed tickets
        if (currentStatus === "CLOSED") {
            return userRole === "ADMIN" && nextStatus === "OPEN";
        }

        return allowedTransitions[currentStatus].includes(nextStatus);
    }

    /**
     * Check if user can view a ticket
     */
    static canView(
        user: SessionUser,
        ticket: { requesterId: string; assigneeId: string | null },
    ): boolean {
        if (user.role === "ADMIN") return true;
        if (user.role === "EMPLOYEE") return ticket.requesterId === user.id;
        if (user.role === "AGENT") return ticket.assigneeId === user.id;
        return false;
    }

    /**
     * Check if user can update a ticket
     */
    static canUpdate(
        user: SessionUser,
        ticket: { requesterId: string; assigneeId: string | null; status: TicketStatus },
    ): boolean {
        if (user.role === "ADMIN") return true;
        if (user.role === "AGENT") return ticket.assigneeId === user.id;
        if (user.role === "EMPLOYEE") {
            // Employees can only update their own open tickets
            return ticket.requesterId === user.id && ticket.status !== "CLOSED";
        }
        return false;
    }

    /**
     * Check if user can delete a ticket
     */
    static canDelete(user: SessionUser): boolean {
        return user.role === "ADMIN";
    }

    /**
     * Check if user can assign tickets
     */
    static canAssign(user: SessionUser): boolean {
        return user.role === "ADMIN";
    }

    /**
     * Check if user can create ticket for others
     */
    static canCreateForOthers(user: SessionUser): boolean {
        return user.role === "ADMIN";
    }

    /**
     * Check if user is active agent
     */
    static isActiveAgent(role: Role, isActive: boolean): boolean {
        return role === "AGENT" && isActive;
    }

    /**
     * Get ticket filter for user role
     */
    static getFilterForRole(user: SessionUser): {
        requesterId?: string;
        assigneeId?: string;
    } {
        if (user.role === "EMPLOYEE") {
            return { requesterId: user.id };
        } else if (user.role === "AGENT") {
            return { assigneeId: user.id };
        }
        return {};
    }
}
