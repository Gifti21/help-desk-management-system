export type NotificationType =
  | 'TICKET_ASSIGNED'
  | 'TICKET_STATUS_CHANGED'
  | 'TICKET_COMMENT'
  | 'TICKET_CLOSED'
  | 'TICKET_PRIORITY_CHANGED';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  ticketId: string;
  read: boolean;
  createdAt: string;
}
