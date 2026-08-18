import { STATUS, PRIORITY } from "@/lib/colors";
import type { TicketStatus, TicketPriority } from "@/lib/types/ticket";

export const statusColors: Record<TicketStatus, { text: string; background: string; border: string }> = {
  Open: { text: STATUS.open.text, background: STATUS.open.background, border: STATUS.open.border },
  "In Progress": { text: STATUS.inProgress.text, background: STATUS.inProgress.background, border: STATUS.inProgress.border },
  Resolved: { text: STATUS.resolved.text, background: STATUS.resolved.background, border: STATUS.resolved.border },
  Closed: { text: STATUS.closed.text, background: STATUS.closed.background, border: STATUS.closed.border },
};

export const priorityColors: Record<TicketPriority, { text: string; background: string; border: string }> = {
  Low: { text: PRIORITY.low.text, background: PRIORITY.low.background, border: PRIORITY.low.border },
  Medium: { text: PRIORITY.medium.text, background: PRIORITY.medium.background, border: PRIORITY.medium.border },
  High: { text: PRIORITY.high.text, background: PRIORITY.high.background, border: PRIORITY.high.border },
};

export const getStatusColors = (status: TicketStatus) => statusColors[status];
export const getPriorityColors = (priority: TicketPriority) => priorityColors[priority];
