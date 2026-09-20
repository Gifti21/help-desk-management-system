import { prisma } from "@/src/infrastructure/database/prisma";
import { Prisma } from "@prisma/client";

export class CategoryRepository {
    async findAll() {
        return await prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        tickets: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });
    }

    async findById(id: string) {
        return await prisma.category.findUnique({
            where: { id },
        });
    }

    async findByName(name: string) {
        return await prisma.category.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                },
            },
        });
    }

    async create(data: Prisma.CategoryCreateInput) {
        return await prisma.category.create({
            data,
        });
    }

    async update(id: string, data: Prisma.CategoryUpdateInput) {
        return await prisma.category.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return await prisma.category.delete({
            where: { id },
        });
    }
}
