import { prisma } from "@/src/infrastructure/database/prisma";
import { TicketStatus } from "@prisma/client";

export class DashboardRepository {
    // Ticket counts
    async countAllTickets() {
        return await prisma.ticket.count();
    }

    async countTicketsByStatus(status: TicketStatus) {
        return await prisma.ticket.count({ where: { status } });
    }

    async countTicketsByAssignee(assigneeId: string) {
        return await prisma.ticket.count({ where: { assigneeId } });
    }

    async countTicketsByAssigneeAndStatus(assigneeId: string, status: TicketStatus) {
        return await prisma.ticket.count({ where: { assigneeId, status } });
    }

    async countTicketsByRequester(requesterId: string) {
        return await prisma.ticket.count({ where: { requesterId } });
    }

    async countTicketsByRequesterAndStatus(requesterId: string, status: TicketStatus) {
        return await prisma.ticket.count({ where: { requesterId, status } });
    }

    // User counts
    async countAllUsers() {
        return await prisma.user.count();
    }

    async countActiveUsers() {
        return await prisma.user.count({ where: { isActive: true } });
    }

    // Other counts
    async countAllDepartments() {
        return await prisma.department.count();
    }

    async countAllCategories() {
        return await prisma.category.count();
    }

    // Recent tickets
    async getRecentTickets(limit: number) {
        return await prisma.ticket.findMany({
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                category: { select: { id: true, name: true } },
                department: { select: { id: true, name: true } },
                requester: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }

    async getTicketsByAssignee(assigneeId: string, limit: number) {
        return await prisma.ticket.findMany({
            where: { assigneeId },
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                category: { select: { id: true, name: true } },
                department: { select: { id: true, name: true } },
                requester: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }

    async getTicketsByRequester(requesterId: string, limit: number) {
        return await prisma.ticket.findMany({
            where: { requesterId },
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                category: { select: { id: true, name: true } },
                department: { select: { id: true, name: true } },
                assignee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }

    // Analytics
    async getTicketsByDepartment() {
        const tickets = await prisma.ticket.groupBy({
            by: ['departmentId'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
        });

        const departments = await prisma.department.findMany({
            where: { id: { in: tickets.map(t => t.departmentId) } },
            select: { id: true, name: true },
        });

        return tickets.map(ticket => {
            const dept = departments.find(d => d.id === ticket.departmentId);
            return {
                department: dept?.name || 'Unknown',
                count: ticket._count.id,
            };
        });
    }

    async getMonthlyTickets() {
        const tickets = await prisma.ticket.findMany({
            select: { createdAt: true },
            orderBy: { createdAt: 'asc' },
        });

        // Group by month
        const monthlyData: Record<string, number> = {};
        tickets.forEach(ticket => {
            const date = new Date(ticket.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
        });

        // Get last 6 months
        const now = new Date();
        const labels: string[] = [];
        const data: number[] = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = date.toLocaleString('default', { month: 'short' });

            labels.push(monthName);
            data.push(monthlyData[monthKey] || 0);
        }

        return { labels, data };
    }
}
