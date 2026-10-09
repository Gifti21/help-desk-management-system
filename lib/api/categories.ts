// API service for Category operations
import { handleJsonResponse } from "@/lib/api-client";

export interface Category {
    id: string;
    name: string;
    createdAt: string;
    _count?: {
        tickets: number;
    };
}

export interface CategoryCreateData {
    name: string;
}

export interface CategoryUpdateData {
    name?: string;
}

export async function getCategories(): Promise<Category[]> {
    const response = await fetch('/api/admin/categories', {
        method: 'GET',
        credentials: 'include',
    });

    const result = await handleJsonResponse(response);
    return result.data;
}

export async function createCategory(data: CategoryCreateData): Promise<Category> {
    const response = await fetch('/api/admin/categories', {
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

export async function updateCategory(id: string, data: CategoryUpdateData): Promise<Category> {
    const response = await fetch(`/api/admin/categories/${id}`, {
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

export async function deleteCategory(id: string): Promise<void> {
    const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    await handleJsonResponse(response);
}
