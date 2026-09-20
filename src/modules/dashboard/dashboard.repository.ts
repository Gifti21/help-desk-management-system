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
                    },
                },
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
}
