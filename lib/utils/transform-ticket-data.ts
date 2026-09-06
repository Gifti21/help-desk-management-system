/**
 * Utility to transform ticket data from API format to UI format
 * Handles nested objects that need to be converted to strings for rendering
 */

export interface ApiTicket {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    categoryId: string;
    departmentId: string;
    requesterId: string;
    assigneeId: string | null;
    createdAt: string;
    updatedAt: string;
    category: { id: string; name: string };
    department: { id: string; name: string };
    requester?: { id: string; firstName: string; lastName: string; email: string };
    assignee?: { id: string; firstName: string; lastName: string; email: string } | null;
    _count?: { comments: number };
}

export interface UiTicket {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    category: string; // Just the name
    department: string; // Just the name
    categoryId: string;
    departmentId: string;
    requester: string; // Full name
    requesterId: string;
    requesterEmail?: string;
    assignee: string | null; // Full name or null
    assigneeId: string | null;
    assigneeEmail?: string;
    createdAt: string;
    updatedAt: string;
    lastUpdated: string;
    commentCount: number;
}

/**
 * Transform a single ticket from API format to UI format
 */
export function transformTicket(ticket: ApiTicket): UiTicket {
    return {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        category: typeof ticket.category === 'object' ? ticket.category.name : ticket.category,
        department: typeof ticket.department === 'object' ? ticket.department.name : ticket.department,
        categoryId: ticket.categoryId,
        departmentId: ticket.departmentId,
        requester: ticket.requester
            ? `${ticket.requester.firstName} ${ticket.requester.lastName}`
            : 'Unknown',
        requesterId: ticket.requesterId,
        requesterEmail: ticket.requester?.email,
        assignee: ticket.assignee
            ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}`
            : null,
        assigneeId: ticket.assigneeId,
        assigneeEmail: ticket.assignee?.email,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        lastUpdated: ticket.updatedAt,
        commentCount: ticket._count?.comments || 0,
    };
}

/**
 * Transform an array of tickets from API format to UI format
 */
export function transformTickets(tickets: ApiTicket[]): UiTicket[] {
    return tickets.map(transformTicket);
}

/**
 * Transform for TicketTable component (legacy format support)
 */
export function transformTicketForTable(ticket: any): any {
    return {
        id: ticket.id,
        title: ticket.title,
        category: typeof ticket.category === 'object' ? ticket.category.name : ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        lastUpdated: ticket.updatedAt || ticket.lastUpdated,
    };
}

/**
 * Safe rendering helper - extracts string from object if needed
 */
export function safeRenderField(field: any): string {
    if (typeof field === 'string') return field;
    if (typeof field === 'object' && field !== null) {
        return field.name || field.title || JSON.stringify(field);
    }
    return String(field || '');
}