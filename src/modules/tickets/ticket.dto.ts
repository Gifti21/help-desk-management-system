export interface CreateTicketDto {
    title: string;
    description: string;
    categoryId: string;
    departmentId: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    requesterId?: string;
    requesterEmail?: string;
}

export interface UpdateTicketDto {
    title?: string;
    description?: string;
    status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    assigneeId?: string | null;
    categoryId?: string;
    departmentId?: string;
}

export interface TicketFilters {
    status?: string | null;
    priority?: string | null;
    search?: string | null;
    departmentId?: string | null;
    categoryId?: string | null;
    assigneeId?: string | null;
    requesterId?: string;
}
