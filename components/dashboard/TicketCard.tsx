"use client";

import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
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
import { BODY_SM, CAPTION_REGULAR, FONT_FAMILY, HEADING_XS } from "@/lib/fonts";
import type { Ticket } from "@/types/ticket";

interface TicketCardProps {
  ticket: Ticket;
  showAssignee?: boolean;
}

export function TicketCard({ ticket, showAssignee = true }: TicketCardProps) {
  const deptName =
    typeof ticket.department === "object" && ticket.department
      ? ticket.department.name
      : ticket.department ||
        (typeof ticket.category === "object" && ticket.category
          ? ticket.category.name
          : ticket.category) ||
        "IT Support";

  return (
    <Link href={`/dashboard/technician/queue`} className="block">
      <Card className="bg-white border-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
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

            <h3
              className="truncate font-bold text-slate-900"
              style={{
                fontFamily: FONT_FAMILY.primary,
                fontSize: HEADING_XS.size,
              }}
            >
              {ticket.title}
            </h3>

            <p
              className="line-clamp-2 text-slate-600"
              style={{
                fontFamily: FONT_FAMILY.primary,
                fontSize: BODY_SM.size,
              }}
            >
              {ticket.description}
            </p>

            <div
              className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500"
              style={{
                fontFamily: FONT_FAMILY.primary,
                fontSize: CAPTION_REGULAR.size,
              }}
            >
              <span>{deptName}</span>
              <span>
                {ticket.creatorName ||
                  (ticket.requester
                    ? getUserDisplayName(ticket.requester)
                    : "Employee")}
              </span>
              <span>{formatDate(ticket.updatedAt)}</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 self-start">
            <div className="inline-flex items-center gap-1 rounded-full px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200">
              <MessageSquare size={14} />
              <span style={{ fontSize: CAPTION_REGULAR.size }}>
                {ticket.comments?.length || ticket.commentCount || 0}
              </span>
            </div>
            {showAssignee ? (
              <span
                style={{
                  color: BODY_TEXT_GREY,
                  fontSize: CAPTION_REGULAR.size,
                }}
              >
                {ticket.assigneeName ||
                  (ticket.assignee
                    ? getUserDisplayName(ticket.assignee)
                    : "Bontu")}
              </span>
            ) : null}
            <ArrowRight size={18} style={{ color: "#0E2621" }} />
          </div>
        </div>
      </Card>
    </Link>
  );
}
