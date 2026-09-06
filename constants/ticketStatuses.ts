import type { TicketStatus } from "@/types/ticket";

export const TICKET_STATUSES: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export const TICKET_STATUS_COLORS: Record<TicketStatus, string> = {
  OPEN: "#0284C7",
  IN_PROGRESS: "#D97706",
  RESOLVED: "#059669",
  CLOSED: "#475569",
};
