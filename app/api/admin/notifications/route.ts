import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/notifications - Get admin notifications from system events (Admin only)
 * Generates notifications from recent tickets, users, and system activity
 */
export async function GET(request: NextRequest) {
    try {
        const user = await getSessionUser();

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Get recent system events in parallel
        const [
            recentUsers,
            criticalTickets,
            highPriorityTickets,
            unassignedTickets,
            recentTickets
        ] = await Promise.all([
            // New user registrations (last 7 days)
            prisma.user.findMany({
                where: {
                    createdAt: { gte: oneWeekAgo }
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true,
                    createdAt: true
                }
            }),

            // Critical priority tickets
            prisma.ticket.findMany({
                where: {
                    priority: 'CRITICAL',
                    status: { in: ['OPEN', 'IN_PROGRESS'] }
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    title: true,
                    priority: true,
                    status: true,
                    createdAt: true,
                    requester: {
                        select: { firstName: true, lastName: true }
                    }
                }
            }),

            // High priority tickets created recently
            prisma.ticket.findMany({
                where: {
                    priority: 'HIGH',
                    status: { in: ['OPEN', 'IN_PROGRESS'] },
                    createdAt: { gte: oneDayAgo }
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    title: true,
                    priority: true,
                    status: true,
                    createdAt: true
                }
            }),

            // Unassigned tickets
            prisma.ticket.findMany({
                where: {
                    assigneeId: null,
                    status: { in: ['OPEN', 'IN_PROGRESS'] }
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    title: true,
                    priority: true,
                    createdAt: true
                }
            }),

            // Recent ticket activity (last 24 hours)
            prisma.ticket.findMany({
                where: {
                    updatedAt: { gte: oneDayAgo }
                },
                orderBy: { updatedAt: 'desc' },
                take: 10,
                select: {
                    id: true,
                    title: true,
                    status: true,
                    priority: true,
                    updatedAt: true,
                    assignee: {
                        select: { firstName: true, lastName: true }
                    }
                }
            })
        ]);

        // Generate notifications array
        const notifications: any[] = [];

        // Add new user notifications
        recentUsers.forEach(user => {
            const timeAgo = getTimeAgo(user.createdAt);
            notifications.push({
                id: `user-${user.id}`,
                type: 'USER_REGISTRATION',
                title: 'New User Registration',
                message: `${user.firstName} ${user.lastName} has registered as a new ${user.role.toLowerCase()} and may require account review.`,
                timestamp: timeAgo,
                createdAt: user.createdAt,
                read: false,
                ticketNumber: '',
                metadata: { userId: user.id, email: user.email }
            });
        });

        // Add critical ticket notifications
        criticalTickets.forEach(ticket => {
            const timeAgo = getTimeAgo(ticket.createdAt);
            const requesterName = ticket.requester
                ? `${ticket.requester.firstName} ${ticket.requester.lastName}`
                : 'Unknown User';
            notifications.push({
                id: `critical-${ticket.id}`,
                type: 'CRITICAL_TICKET',
                title: 'Critical Priority Ticket',
                message: `Ticket ${ticket.id} - "${ticket.title}" requires immediate attention. Reported by ${requesterName}.`,
                timestamp: timeAgo,
                createdAt: ticket.createdAt,
                read: false,
                ticketNumber: ticket.id,
                metadata: { ticketId: ticket.id, priority: ticket.priority }
            });
        });

        // Add high priority notifications
        highPriorityTickets.forEach(ticket => {
            const timeAgo = getTimeAgo(ticket.createdAt);
            notifications.push({
                id: `high-${ticket.id}`,
                type: 'HIGH_PRIORITY',
                title: 'High Priority Ticket Created',
                message: `New high priority ticket: "${ticket.title}" (${ticket.status})`,
                timestamp: timeAgo,
                createdAt: ticket.createdAt,
                read: false,
                ticketNumber: ticket.id,
                metadata: { ticketId: ticket.id }
            });
        });

        // Add unassigned ticket notifications
        if (unassignedTickets.length > 0) {
            unassignedTickets.slice(0, 3).forEach(ticket => {
                const timeAgo = getTimeAgo(ticket.createdAt);
                notifications.push({
                    id: `unassigned-${ticket.id}`,
                    type: 'UNASSIGNED_TICKET',
                    title: 'Unassigned Ticket Alert',
                    message: `Ticket ${ticket.id} - "${ticket.title}" is waiting for assignment (Priority: ${ticket.priority}).`,
                    timestamp: timeAgo,
                    createdAt: ticket.createdAt,
                    read: false,
                    ticketNumber: ticket.id,
                    metadata: { ticketId: ticket.id }
                });
            });
        }

        // Add recent activity notifications
        recentTickets.slice(0, 5).forEach(ticket => {
            const timeAgo = getTimeAgo(ticket.updatedAt);
            const assigneeName = ticket.assignee
                ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}`
                : 'Unassigned';
            notifications.push({
                id: `activity-${ticket.id}`,
                type: 'TICKET_UPDATE',
                title: 'Ticket Updated',
                message: `Ticket ${ticket.id} status changed to ${ticket.status}. Assigned to: ${assigneeName}`,
                timestamp: timeAgo,
                createdAt: ticket.updatedAt,
                read: true, // Mark activity as read by default
                ticketNumber: ticket.id,
                metadata: { ticketId: ticket.id, status: ticket.status }
            });
        });

        // Sort by creation date (most recent first)
        notifications.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // Return top 20 notifications
        const topNotifications = notifications.slice(0, 20);

        return NextResponse.json({
            success: true,
            data: {
                notifications: topNotifications,
                unreadCount: topNotifications.filter(n => !n.read).length,
                total: topNotifications.length
            }
        });
    } catch (error) {
        console.error('GET /api/admin/notifications error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}

/**
 * Helper function to calculate relative time
 */
function getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString();
}
