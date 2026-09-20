import { prisma } from "@/src/infrastructure/database/prisma";
import { Prisma, TicketStatus, TicketPriority } from "@prisma/client";
import { standardTicketInclude } from "./ticket.mapper";
import { TicketFilters } from "./ticket.dto";

export class TicketRepository {
    /**
     * Build Prisma where clause from filters
     */
    private buildWhereClause(filters: TicketFilters) {
        const where: any = {};

        // Role-based filter (must be set by caller)
        if (filters.requesterId) {
            where.requesterId = filters.requesterId;
        }
        if (filters.assigneeId) {
            where.assigneeId = filters.assigneeId;
        }

        // Status filter
        if (
            filters.status &&
            filters.status !== "all" &&
            ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(
                filters.status.toUpperCase(),
            )
        ) {
            where.status = filters.status.toUpperCase();
        }

        // Priority filter
        if (
            filters.priority &&
            ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(
                filters.priority.toUpperCase(),
            )
        ) {
            where.priority = filters.priority.toUpperCase();
        }

        // Department filter
        if (filters.departmentId) {
            where.departmentId = filters.departmentId;
        }

        // Category filter
        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }

        // Search filter
        if (filters.search?.trim()) {
            where.OR = [
                { title: { contains: filters.search.trim(), mode: "insensitive" } },
                { id: { contains: filters.search.trim(), mode: "insensitive" } },
                {
                    category: {
                        name: { contains: filters.search.trim(), mode: "insensitive" },
                    },
                },
            ];
        }

        return where;
    }

    async findAll(filters: TicketFilters, page?: number, pageSize?: number) {
        const where = this.buildWhereClause(filters);

        const query: any = {
            where,
            include: standardTicketInclude,
            orderBy: { createdAt: "desc" },
        };

        if (page && pageSize) {
            query.skip = (page - 1) * pageSize;
            query.take = pageSize;
        }

        return await prisma.ticket.findMany(query);
    }

    async count(filters: TicketFilters) {
        const where = this.buildWhereClause(filters);
        return await prisma.ticket.count({ where });
    }

    async findById(id: string, includeComments = false) {
        return await prisma.ticket.findUnique({
            where: { id },
            include: {
                ...standardTicketInclude,
                ...(includeComments && {
                    comments: {
                        include: {
                            author: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                },
                            },
                        },
                        orderBy: { createdAt: "asc" },
                    },
                }),
            },
        });
    }

    async create(data: Prisma.TicketCreateInput) {
        return await prisma.ticket.create({
            data,
            include: {
                category: true,
                department: true,
                requester: {
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

    async update(id: string, data: Prisma.TicketUpdateInput) {
        return await prisma.ticket.update({
            where: { id },
            data,
            include: standardTicketInclude,
        });
    }

    async delete(id: string) {
        return await prisma.ticket.delete({
            where: { id },
        });
    }

    async findUserById(userId: string) {
        return await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                role: true,
                isActive: true,
            },
        });
    }

    async findUserByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: { id: true },
        });
    }
}
