import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "./notification.service";
import { requireAuth } from "@/src/middleware/auth.middleware";
import { handleApiError } from "@/src/shared/errors/error-handler";
import { successResponse } from "@/src/shared/responses/api-response";

export class NotificationController {
    private service: NotificationService;

    constructor() {
        this.service = new NotificationService();
    }

    async getNotifications(request: NextRequest): Promise<NextResponse> {
        try {
            const user = await requireAuth();
            const notifications = await this.service.getNotifications(user.id);

            return successResponse(notifications);
        } catch (error) {
            return handleApiError(error);
        }
    }

    async markAsRead(request: NextRequest): Promise<NextResponse> {
        try {
            const user = await requireAuth();
            const body = await request.json();
            await this.service.markAsRead(body.notificationIds, user.id);

            return successResponse({ message: "Notifications marked as read" });
        } catch (error) {
            return handleApiError(error);
        }
    }
}
