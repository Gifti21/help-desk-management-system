import { prisma } from "@/src/infrastructure/database/prisma";
import { Prisma } from "@prisma/client";

export class ProfileRepository {
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

    async updatePassword(id: string, passwordHash: string) {
        return await prisma.user.update({
            where: { id },
            data: { passwordHash },
        });
    }
}
