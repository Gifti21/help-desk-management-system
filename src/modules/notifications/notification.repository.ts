import { prisma } from "@/src/infrastructure/database/prisma";

export class NotificationRepository {
    async findByRecipient(recipientId: string) {
        return await prisma.notification.findMany({
            where: { recipientId },
            orderBy: { createdAt: "desc" },
            include: {
                ticket: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
    }

    async markAsRead(notificationIds: string[], userId: string) {
        return await prisma.notification.updateMany({
            where: {
                id: { in: notificationIds },
                recipientId: userId,
            },
            data: {
                isRead: true,
            },
        });
    }
}
