/**
 * Department API Service
 * Handles all department-related API calls
 */
import { handleJsonResponse } from "@/lib/api-client";

export interface Department {
    id: string;
    name: string;
    createdAt: string;
    _count?: {
        users: number;
        tickets: number;
    };
}

export interface CreateDepartmentDto {
    name: string;
}

export interface UpdateDepartmentDto {
    name?: string;
}

/**
 * Get all departments
 */
export async function getDepartments(): Promise<Department[]> {
    const response = await fetch('/api/admin/departments', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    const data = await handleJsonResponse(response);
    return data.data;
}

/**
 * Get a single department by ID
 */
export async function getDepartment(id: string): Promise<Department> {
    const response = await fetch(`/api/admin/departments/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    const data = await handleJsonResponse(response);
    return data.data;
}

/**
 * Create a new department
 */
export async function createDepartment(dto: CreateDepartmentDto): Promise<Department> {
    const response = await fetch('/api/admin/departments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dto),
    });

    const data = await handleJsonResponse(response);
    return data.data;
}

/**
 * Update a department
 */
export async function updateDepartment(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const response = await fetch(`/api/admin/departments/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dto),
    });

    const data = await handleJsonResponse(response);
    return data.data;
}

/**
 * Delete a department
 */
export async function deleteDepartment(id: string): Promise<void> {
    const response = await fetch(`/api/admin/departments/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    await handleJsonResponse(response);
}
