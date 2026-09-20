import { prisma } from "@/src/infrastructure/database/prisma";
import { Prisma } from "@prisma/client";

export class DepartmentRepository {
    async findAll() {
        return await prisma.department.findMany({
            include: {
                _count: {
                    select: {
                        users: true,
                        tickets: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findById(id: string) {
        return await prisma.department.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        users: true,
                        tickets: true,
                    },
                },
            },
        });
    }

    async findByName(name: string) {
        return await prisma.department.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });
    }

    async create(data: Prisma.DepartmentCreateInput) {
        return await prisma.department.create({
            data,
        });
    }

    async update(id: string, data: Prisma.DepartmentUpdateInput) {
        return await prisma.department.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return await prisma.department.delete({
            where: { id },
        });
    }
}
