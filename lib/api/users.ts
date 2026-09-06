// API service for User operations

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'AGENT' | 'EMPLOYEE';
    departmentId: string;
    isActive: boolean;
    createdAt: string;
    department?: {
        id: string;
        name: string;
    };
    _count?: {
        requestedTickets: number;
        assignedTickets: number;
    };
}

export interface UserCreateData {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: 'admin' | 'agent' | 'employee';
    departmentId: string;
    isActive?: boolean;
}

export interface UserUpdateData {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    role?: 'admin' | 'agent' | 'employee';
    departmentId?: string;
    isActive?: boolean;
}

export async function getUsers(filters?: {
    role?: string;
    departmentId?: string;
    isActive?: boolean;
}): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.departmentId) params.append('departmentId', filters.departmentId);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));

    const url = `/api/admin/users${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch users');
    }

    const result = await response.json();
    return result.data;
}

export async function createUser(data: UserCreateData): Promise<User> {
    const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error('Create user API error:', error);

        // Show detailed validation message if available
        if (error.message) {
            throw new Error(error.message);
        } else if (error.details && Array.isArray(error.details)) {
            const messages = error.details.map((d: any) => `${d.path?.join('.')}: ${d.message}`).join(', ');
            throw new Error(messages || 'Validation failed');
        } else {
            throw new Error(error.error || 'Failed to create user');
        }
    }

    const result = await response.json();
    return result.data;
}

export async function updateUser(id: string, data: UserUpdateData): Promise<User> {
    const response = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
    }

    const result = await response.json();
    return result.data;
}

export async function deleteUser(id: string): Promise<void> {
    const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
    }
}
