// API service for Category operations

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

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch categories');
    }

    const result = await response.json();
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

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create category');
    }

    const result = await response.json();
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

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update category');
    }

    const result = await response.json();
    return result.data;
}

export async function deleteCategory(id: string): Promise<void> {
    const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
    }
}
