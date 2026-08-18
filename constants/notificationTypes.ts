import type { NotificationType } from '@/types/notification';

export const NOTIFICATION_TYPES: NotificationType[] = [
  'TICKET_ASSIGNED',
  'TICKET_STATUS_CHANGED',
  'TICKET_COMMENT',
  'TICKET_CLOSED',
  'TICKET_PRIORITY_CHANGED',
];

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  TICKET_ASSIGNED: 'Ticket Assigned',
  TICKET_STATUS_CHANGED: 'Status Updated',
  TICKET_COMMENT: 'New Comment',
  TICKET_CLOSED: 'Ticket Closed',
  TICKET_PRIORITY_CHANGED: 'Priority Changed',
};
