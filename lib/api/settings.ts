// API service for Settings
import { handleJsonResponse } from "@/lib/api-client";

export interface SystemInfo {
    version: string;
    dbStatus: string;
    totalUsers: number;
    activeUsers: number;
    totalTickets: number;
    environment: string;
}

export interface AdminProfile {
    email: string;
    firstName: string;
    lastName: string;
}

export interface SettingsData {
    systemInfo: SystemInfo;
    currentAdmin: AdminProfile;
}

export async function getSettings(): Promise<SettingsData> {
    const response = await fetch('/api/admin/settings', {
        method: 'GET',
        credentials: 'include',
    });

    const result = await handleJsonResponse(response);
    return result.data;
}

export async function updateAdminProfile(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
}): Promise<void> {
    const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });

    await handleJsonResponse(response);
}
