// API service for User operations
import { handleJsonResponse } from "@/lib/api-client";

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

    const result = await handleJsonResponse(response);
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

    const result = await handleJsonResponse(response);
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

    const result = await handleJsonResponse(response);
    return result.data;
}

export async function deleteUser(id: string): Promise<void> {
    const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    await handleJsonResponse(response);
}
