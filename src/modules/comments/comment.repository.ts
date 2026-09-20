import { prisma } from "@/src/infrastructure/database/prisma";
import { Prisma } from "@prisma/client";

export class CommentRepository {
    async findByTicketId(ticketId: string) {
        return await prisma.comment.findMany({
            where: { ticketId },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: "asc" },
        });
    }

    async findById(id: string) {
        return await prisma.comment.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }

    async create(data: Prisma.CommentCreateInput) {
        return await prisma.comment.create({
            data,
            include: {
                author: {
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

    async update(id: string, data: Prisma.CommentUpdateInput) {
        return await prisma.comment.update({
            where: { id },
            data,
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }

    async delete(id: string) {
        return await prisma.comment.delete({
            where: { id },
        });
    }
}
