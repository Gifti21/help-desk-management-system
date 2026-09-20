import { NotificationRepository } from "./notification.repository";

export class NotificationService {
    private repository: NotificationRepository;

    constructor() {
        this.repository = new NotificationRepository();
    }

    async getNotifications(userId: string) {
        return await this.repository.findByRecipient(userId);
    }

    async markAsRead(notificationIds: string[], userId: string) {
        return await this.repository.markAsRead(notificationIds, userId);
    }
}
