import type { TicketStatus } from '@/types/ticket';

export const TICKET_STATUSES: TicketStatus[] = [
  'OPEN',
  'IN_PROGRESS',
  'PENDING',
  'RESOLVED',
  'CLOSED',
];

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  PENDING: 'Pending',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
};

export const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  OPEN: '#0284C7',
  IN_PROGRESS: '#D97706',
  PENDING: '#7C3AED',
  RESOLVED: '#059669',
  CLOSED: '#475569',
};
