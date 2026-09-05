import { STATUS, PRIORITY } from "@/lib/colors";
import type { TicketStatus, TicketPriority } from "@/lib/types/ticket";

export const statusColors: Record<string, { text: string; background: string; border: string }> = {
  OPEN: { text: STATUS.open.text, background: STATUS.open.background, border: STATUS.open.border },
  "IN_PROGRESS": { text: STATUS.inProgress.text, background: STATUS.inProgress.background, border: STATUS.inProgress.border },
  RESOLVED: { text: STATUS.resolved.text, background: STATUS.resolved.background, border: STATUS.resolved.border },
  CLOSED: { text: STATUS.closed.text, background: STATUS.closed.background, border: STATUS.closed.border },
  // Legacy support
  "Open": { text: STATUS.open.text, background: STATUS.open.background, border: STATUS.open.border },
  "In Progress": { text: STATUS.inProgress.text, background: STATUS.inProgress.background, border: STATUS.inProgress.border },
  "Resolved": { text: STATUS.resolved.text, background: STATUS.resolved.background, border: STATUS.resolved.border },
  "Closed": { text: STATUS.closed.text, background: STATUS.closed.background, border: STATUS.closed.border },
};

export const priorityColors: Record<string, { text: string; background: string; border: string }> = {
  LOW: { text: PRIORITY.low.text, background: PRIORITY.low.background, border: PRIORITY.low.border },
  MEDIUM: { text: PRIORITY.medium.text, background: PRIORITY.medium.background, border: PRIORITY.medium.border },
  HIGH: { text: PRIORITY.high.text, background: PRIORITY.high.background, border: PRIORITY.high.border },
  CRITICAL: { text: "#ffffff", background: "#dc2626", border: "#dc2626" }, // Red for critical
  // Legacy support
  "Low": { text: PRIORITY.low.text, background: PRIORITY.low.background, border: PRIORITY.low.border },
  "Medium": { text: PRIORITY.medium.text, background: PRIORITY.medium.background, border: PRIORITY.medium.border },
  "High": { text: PRIORITY.high.text, background: PRIORITY.high.background, border: PRIORITY.high.border },
};

export const getStatusColors = (status: string) => statusColors[status] || statusColors.OPEN;
export const getPriorityColors = (priority: string) => priorityColors[priority] || priorityColors.MEDIUM;
