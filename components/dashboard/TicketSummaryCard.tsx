"use client";

import { PRIORITY_COLORS, PRIORITY_LABELS } from "@/constants/priorities";
import {
  TICKET_STATUS_COLORS,
  TICKET_STATUS_LABELS,
} from "@/constants/ticketStatuses";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/utils/formatDate";
import { getUserDisplayName } from "@/lib/ticketMapper";
import { BODY_TEXT_GREY, PRIMARY_TEXT } from "@/lib/colors";
import { BODY_SM, CAPTION_REGULAR, FONT_FAMILY, HEADING_MD } from "@/lib/fonts";
import type { Ticket } from "@/types/ticket";

interface TicketSummaryCardProps {
  ticket: Ticket;
}

export function TicketSummaryCard({ ticket }: TicketSummaryCardProps) {
  const deptName =
    typeof ticket.department === "object" && ticket.department
      ? ticket.department.name
      : ticket.department || "IT Support";
  const catName =
    typeof ticket.category === "object" && ticket.category
      ? ticket.category.name
      : ticket.category || "IT Support";
  const requesterName =
    ticket.creatorName ||
    (ticket.requester ? getUserDisplayName(ticket.requester) : "Employee");
  const assigneeName =
    ticket.assigneeName ||
    (ticket.assignee
      ? getUserDisplayName(ticket.assignee)
      : "Bontu (Support Agent)");

  const details = [
    { label: "Requester", value: requesterName },
    { label: "Department", value: deptName },
    { label: "Category", value: catName },
    {
      label: "Assignee",
      value: assigneeName,
    },
    { label: "Created", value: formatDate(ticket.createdAt) },
    { label: "Last Updated", value: formatDate(ticket.updatedAt) },
  ];

  return (
    <Card className="bg-white border-slate-200">
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="font-mono font-bold text-xs text-[#0E2621]">
              Ticket #{ticket.ticketNumber || ticket.id}
            </p>
            <h1
              className="text-slate-900 font-extrabold"
              style={{
                fontFamily: FONT_FAMILY.primary,
                fontSize: HEADING_MD.size,
              }}
            >
              {ticket.title}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              label={TICKET_STATUS_LABELS[ticket.status] || ticket.status}
              backgroundColor={`${TICKET_STATUS_COLORS[ticket.status] || "#0E2621"}22`}
              color={TICKET_STATUS_COLORS[ticket.status] || "#0E2621"}
            />
            <Badge
              label={PRIORITY_LABELS[ticket.priority] || ticket.priority}
              backgroundColor={`${PRIORITY_COLORS[ticket.priority] || "#0E2621"}22`}
              color={PRIORITY_COLORS[ticket.priority] || "#0E2621"}
            />
          </div>
        </div>

        <p className="text-slate-700" style={{ fontSize: BODY_SM.size }}>
          {ticket.description}
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="rounded-xl border px-4 py-3 bg-slate-50 border-slate-200"
            >
              <p className="text-slate-500 font-mono text-[10px] uppercase font-bold">
                {detail.label}
              </p>
              <p
                className="mt-1 text-slate-900 font-bold"
                style={{
                  fontFamily: FONT_FAMILY.primary,
                  fontSize: BODY_SM.size,
                }}
              >
                {detail.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
