// API service for Settings

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

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch settings');
    }

    const result = await response.json();
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

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
    }
}
