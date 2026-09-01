// API service for Ticket operations

export interface Ticket {
    id: string;
    title: string;
    description: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    categoryId: string;
    departmentId: string;
    requesterId: string;
    assigneeId: string | null;
    createdAt: string;
    updatedAt: string;
    category?: {
        id: string;
        name: string;
    };
    department?: {
        id: string;
        name: string;
    };
    requester?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    assignee?: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    } | null;
    _count?: {
        comments: number;
    };
}

export interface TicketCreateData {
    title: string;
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    categoryId: string;
    departmentId: string;
    requesterId: string;
    assigneeId?: string;
}

export interface TicketUpdateData {
    title?: string;
    description?: string;
    status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    categoryId?: string;
    departmentId?: string;
    assigneeId?: string | null;
}

export async function getTickets(filters?: {
    status?: string;
    priority?: string;
    categoryId?: string;
    departmentId?: string;
    assigneeId?: string;
}): Promise<Ticket[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.departmentId) params.append('departmentId', filters.departmentId);
    if (filters?.assigneeId) params.append('assigneeId', filters.assigneeId);

    const url = `/api/admin/tickets${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch tickets');
    }

    const result = await response.json();
    return result.data;
}

export async function createTicket(data: TicketCreateData): Promise<Ticket> {
    const response = await fetch('/api/admin/tickets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create ticket');
    }

    const result = await response.json();
    return result.data;
}

export async function updateTicket(id: string, data: TicketUpdateData): Promise<Ticket> {
    const response = await fetch(`/api/admin/tickets/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update ticket');
    }

    const result = await response.json();
    return result.data;
}

export async function deleteTicket(id: string): Promise<void> {
    const response = await fetch(`/api/admin/tickets/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete ticket');
    }
}
