type ApiUser = {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
};

/**
 * Map database ticket to API response
 */
export function mapTicketToResponse(ticket: any) {
    return {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        category: ticket.category,
        department: ticket.department,
        requester: ticket.requester,
        assignee: ticket.assignee,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        closedAt: ticket.closedAt,
        _count: ticket._count,
    };
}

/**
 * Get user display name
 */
export function getUserDisplayName(
    user?: { firstName: string; lastName: string } | null,
): string {
    if (!user) return "Unknown";
    return `${user.firstName} ${user.lastName}`.trim();
}

/**
 * Standard ticket include clause for Prisma queries
 */
export const standardTicketInclude = {
    category: { select: { id: true, name: true } },
    department: { select: { id: true, name: true } },
    requester: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
        },
    },
    assignee: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
        },
    },
    _count: {
        select: { comments: true },
    },
};
