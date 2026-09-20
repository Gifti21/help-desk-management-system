import { NextRequest } from "next/server";
import { NotificationController } from "@/src/modules/notifications/notification.controller";

const controller = new NotificationController();

/**
 * GET /api/notifications - Get user notifications
 */
export async function GET(request: NextRequest) {
  return controller.getNotifications(request);
}

/**
 * PATCH /api/notifications - Mark notifications as read
 */
export async function PATCH(request: NextRequest) {
  return controller.markAsRead(request);
}
