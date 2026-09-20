import { prisma } from "@/src/infrastructure/database/prisma";
import { Prisma } from "@prisma/client";

export class UserRepository {
    async findAll(filters?: {
        role?: string;
        departmentId?: string;
        isActive?: boolean;
    }) {
        const where: any = {};
        if (filters?.role) where.role = filters.role;
        if (filters?.departmentId) where.departmentId = filters.departmentId;
        if (filters?.isActive !== undefined) where.isActive = filters.isActive;

        return await prisma.user.findMany({
            where,
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        requestedTickets: true,
                        assignedTickets: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findById(id: string) {
        return await prisma.user.findUnique({
            where: { id },
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
    }

    async create(data: Prisma.UserCreateInput) {
        return await prisma.user.create({
            data,
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async update(id: string, data: Prisma.UserUpdateInput) {
        return await prisma.user.update({
            where: { id },
            data,
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    async delete(id: string) {
        return await prisma.user.delete({
            where: { id },
        });
    }
}
