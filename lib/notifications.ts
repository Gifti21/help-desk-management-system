import { Prisma } from "@prisma/client";

type NotificationTransaction = Prisma.TransactionClient;

type TicketNotificationEvent = {
  ticketId: string;
  title: string;
  requesterId: string;
  assigneeId: string | null;
  actorId: string;
  type:
    | "TICKET_ASSIGNED"
    | "TICKET_STATUS_CHANGED"
    | "TICKET_PRIORITY_CHANGED"
    | "TICKET_COMMENT"
    | "TICKET_CLOSED";
  message: string;
};

export async function createTicketNotifications(
  tx: NotificationTransaction,
  event: TicketNotificationEvent,
) {
  const recipientIds = [
    ...new Set([event.requesterId, event.assigneeId]),
  ].filter((id): id is string => Boolean(id) && id !== event.actorId);

  if (recipientIds.length === 0) return;

  await tx.notification.createMany({
    data: recipientIds.map((recipientId) => ({
      type: event.type,
      title: event.title,
      message: event.message,
      recipientId,
      ticketId: event.ticketId,
    })),
  });
}
