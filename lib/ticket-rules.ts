import type { Role, TicketStatus } from "@prisma/client";

const allowedTransitions: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ["IN_PROGRESS", "RESOLVED", "CLOSED"],
  IN_PROGRESS: ["OPEN", "RESOLVED", "CLOSED"],
  RESOLVED: ["IN_PROGRESS", "CLOSED"],
  CLOSED: ["OPEN"],
};

export function canTransitionStatus(
  currentStatus: TicketStatus,
  nextStatus: TicketStatus,
  role: Role,
): boolean {
  if (currentStatus === nextStatus) return true;
  if (currentStatus === "CLOSED")
    return role === "ADMIN" && nextStatus === "OPEN";
  return allowedTransitions[currentStatus].includes(nextStatus);
}

export function isActiveAgent(role: Role, isActive: boolean): boolean {
  return role === "AGENT" && isActive;
}
