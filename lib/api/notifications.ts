// API service for Notifications

export interface Notification {
    id: string;
    type: 'USER_REGISTRATION' | 'CRITICAL_TICKET' | 'HIGH_PRIORITY' | 'UNASSIGNED_TICKET' | 'TICKET_UPDATE';
    title: string;
    message: string;
    timestamp: string;
    createdAt: Date;
    read: boolean;
    ticketNumber: string;
    metadata?: any;
}

export interface NotificationsData {
    notifications: Notification[];
    unreadCount: number;
    total: number;
}

export async function getNotifications(): Promise<NotificationsData> {
    const response = await fetch('/api/admin/notifications', {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch notifications');
    }

    const result = await response.json();
    return result.data;
}
