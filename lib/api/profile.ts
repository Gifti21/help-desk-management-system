// API service for Profile
import { handleJsonResponse } from "@/lib/api-client";

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'AGENT' | 'EMPLOYEE';
    departmentId: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    department: {
        id: string;
        name: string;
    };
}

export interface ProfileUpdateData {
    firstName?: string;
    lastName?: string;
    email?: string;
}

export interface PasswordChangeData {
    currentPassword: string;
    newPassword: string;
}

export async function getProfile(): Promise<UserProfile> {
    const response = await fetch('/api/admin/profile', {
        method: 'GET',
        credentials: 'include',
    });

    const result = await handleJsonResponse(response);
    return result.data;
}

export async function updateProfile(data: ProfileUpdateData): Promise<UserProfile> {
    const response = await fetch('/api/admin/profile', {
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

export async function changePassword(data: PasswordChangeData): Promise<void> {
    const response = await fetch('/api/admin/profile/password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    await handleJsonResponse(response);
}
