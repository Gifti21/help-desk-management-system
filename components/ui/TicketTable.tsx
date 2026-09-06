"use client";

import { ChevronRight, FileX } from "lucide-react";
import {
  BORDER_GREY,
  BODY_TEXT_GREY,
  PRIMARY_TEXT,
  PAGE_BACKGROUND,
  SECONDARY_BACKGROUND,
  LIGHT_TEAL_BG,
} from "@/lib/colors";
import { BODY_REGULAR, BODY_SM, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";

type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";
type TicketPriority = "Low" | "Medium" | "High";
type TicketCategory =
  | "Hardware"
  | "Software"
  | "Network"
  | "Account Access"
  | "Other";

interface Ticket {
  id: string;
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  lastUpdated: string;
}

interface TicketTableProps {
  tickets: Ticket[];
  onRowClick: (ticketId: string) => void;
  statusColors: Record<
    TicketStatus,
    { text: string; background: string; border: string }
  >;
  priorityColors: Record<
    TicketPriority,
    { text: string; background: string; border: string }
  >;
}

export function TicketTable({
  tickets,
  onRowClick,
  statusColors,
  priorityColors,
}: TicketTableProps) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: LIGHT_TEAL_BG }}
        >
          <FileX className="h-8 w-8" style={{ color: BODY_TEXT_GREY }} />
        </div>
        <p
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: BODY_REGULAR.size,
            lineHeight: BODY_REGULAR.lineHeight,
            fontWeight: FONT_WEIGHT.medium,
            letterSpacing: BODY_REGULAR.letterSpacing,
            color: BODY_TEXT_GREY,
          }}
        >
          No tickets match your search
        </p>
        <p
          className="mt-2"
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: BODY_SM.size,
            lineHeight: BODY_SM.lineHeight,
            fontWeight: BODY_SM.weight,
            letterSpacing: BODY_SM.letterSpacing,
            color: BODY_TEXT_GREY,
          }}
        >
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER_GREY}` }}>
              <th
                className="text-left pb-4 font-semibold"
                style={{
                  fontFamily: FONT_FAMILY.primary,
                  fontSize: BODY_SM.size,
                  lineHeight: BODY_SM.lineHeight,
                  fontWeight: FONT_WEIGHT.semibold,
                  letterSpacing: BODY_SM.letterSpacing,
                  color: BODY_TEXT_GREY,
                }}
              >
                Ticket ID
              </th>
              <th
                className="text-left pb-4 font-semibold"
                style={{
                  fontFamily: FONT_FAMILY.primary,
                  fontSize: BODY_SM.size,
                  lineHeight: BODY_SM.lineHeight,
                  fontWeight: FONT_WEIGHT.semibold,
                  letterSpacing: BODY_SM.letterSpacing,
                  color: BODY_TEXT_GREY,
                }}
              >
                Title
              </th>
              <th
                className="text-left pb-4 font-semibold"
                style={{
                  fontFamily: FONT_FAMILY.primary,
                  fontSize: BODY_SM.size,
                  lineHeight: BODY_SM.lineHeight,
                  fontWeight: FONT_WEIGHT.semibold,
                  letterSpacing: BODY_SM.letterSpacing,
                  color: BODY_TEXT_GREY,
                }}
              >
                Category
              </th>
              <th
                className="text-left pb-4 font-semibold"
                style={{
                  fontFamily: FONT_FAMILY.primary,
                  fontSize: BODY_SM.size,
                  lineHeight: BODY_SM.lineHeight,
                  fontWeight: FONT_WEIGHT.semibold,
                  letterSpacing: BODY_SM.letterSpacing,
                  color: BODY_TEXT_GREY,
                }}
              >
                Priority
              </th>
              <th
                className="text-left pb-4 font-semibold"
                style={{
                  fontFamily: FONT_FAMILY.primary,
                  fontSize: BODY_SM.size,
                  lineHeight: BODY_SM.lineHeight,
                  fontWeight: FONT_WEIGHT.semibold,
                  letterSpacing: BODY_SM.letterSpacing,
                  color: BODY_TEXT_GREY,
                }}
              >
                Status
              </th>
              <th
                className="text-left pb-4 font-semibold"
                style={{
                  fontFamily: FONT_FAMILY.primary,
                  fontSize: BODY_SM.size,
                  lineHeight: BODY_SM.lineHeight,
                  fontWeight: FONT_WEIGHT.semibold,
                  letterSpacing: BODY_SM.letterSpacing,
                  color: BODY_TEXT_GREY,
                }}
              >
                Last Updated
              </th>
              <th className="pb-4" />
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="cursor-pointer transition"
                style={{ borderBottom: `1px solid ${BORDER_GREY}` }}
                onClick={() => onRowClick(ticket.id)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#dcfce7")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <td
                  className="py-4"
                  style={{
                    fontFamily: FONT_FAMILY.primary,
                    fontSize: BODY_REGULAR.size,
                    lineHeight: BODY_REGULAR.lineHeight,
                    fontWeight: FONT_WEIGHT.medium,
                    letterSpacing: BODY_REGULAR.letterSpacing,
                    color: PRIMARY_TEXT,
                  }}
                >
                  {ticket.id}
                </td>
                <td
                  className="py-4"
                  style={{
                    fontFamily: FONT_FAMILY.primary,
                    fontSize: BODY_REGULAR.size,
                    lineHeight: BODY_REGULAR.lineHeight,
                    fontWeight: FONT_WEIGHT.medium,
                    letterSpacing: BODY_REGULAR.letterSpacing,
                    color: PRIMARY_TEXT,
                  }}
                >
                  {ticket.title}
                </td>
                <td className="py-4">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm"
                    style={{
                      fontFamily: FONT_FAMILY.primary,
                      fontSize: BODY_SM.size,
                      lineHeight: BODY_SM.lineHeight,
                      fontWeight: FONT_WEIGHT.medium,
                      letterSpacing: BODY_SM.letterSpacing,
                      color: BODY_TEXT_GREY,
                      backgroundColor: PAGE_BACKGROUND,
                      border: `1px solid ${BORDER_GREY}`,
                    }}
                  >
                    {ticket.category}
                  </span>
                </td>
                <td className="py-4">
                  <Badge
                    style={{
                      backgroundColor:
                        priorityColors[ticket.priority]?.background || priorityColors.MEDIUM.background,
                      color: priorityColors[ticket.priority]?.text || priorityColors.MEDIUM.text,
                      border: `1px solid ${priorityColors[ticket.priority]?.border || priorityColors.MEDIUM.border}`,
                    }}
                  >
                    {ticket.priority}
                  </Badge>
                </td>
                <td className="py-4">
                  <Badge
                    style={{
                      backgroundColor: statusColors[ticket.status]?.background || statusColors.OPEN.background,
                      color: statusColors[ticket.status]?.text || statusColors.OPEN.text,
                      border: `1px solid ${statusColors[ticket.status]?.border || statusColors.OPEN.border}`,
                    }}
                  >
                    {ticket.status}
                  </Badge>
                </td>
                <td
                  className="py-4"
                  style={{
                    fontFamily: FONT_FAMILY.primary,
                    fontSize: BODY_REGULAR.size,
                    lineHeight: BODY_REGULAR.lineHeight,
                    fontWeight: FONT_WEIGHT.medium,
                    letterSpacing: BODY_REGULAR.letterSpacing,
                    color: BODY_TEXT_GREY,
                  }}
                >
                  {ticket.lastUpdated}
                </td>
                <td className="py-4 text-right">
                  <ChevronRight
                    className="h-5 w-5 inline"
                    style={{ color: BODY_TEXT_GREY }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {tickets.map((ticket) => (
          <Card
            key={ticket.id}
            variant="elevated"
            className="p-4 cursor-pointer transition"
            style={{ borderColor: BORDER_GREY }}
            onClick={() => onRowClick(ticket.id)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#dcfce7")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = PAGE_BACKGROUND)
            }
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p
                  className="mb-1"
                  style={{
                    fontFamily: FONT_FAMILY.primary,
                    fontSize: BODY_SM.size,
                    lineHeight: BODY_SM.lineHeight,
                    fontWeight: FONT_WEIGHT.semibold,
                    letterSpacing: BODY_SM.letterSpacing,
                    color: BODY_TEXT_GREY,
                  }}
                >
                  {ticket.id}
                </p>
                <p
                  style={{
                    fontFamily: FONT_FAMILY.primary,
                    fontSize: BODY_REGULAR.size,
                    lineHeight: BODY_REGULAR.lineHeight,
                    fontWeight: FONT_WEIGHT.medium,
                    letterSpacing: BODY_REGULAR.letterSpacing,
                    color: PRIMARY_TEXT,
                  }}
                >
                  {ticket.title}
                </p>
              </div>
              <ChevronRight
                className="h-5 w-5"
                style={{ color: BODY_TEXT_GREY }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                style={{
                  backgroundColor: priorityColors[ticket.priority].background,
                  color: priorityColors[ticket.priority].text,
                  border: `1px solid ${priorityColors[ticket.priority].border}`,
                }}
              >
                {ticket.priority}
              </Badge>
              <Badge
                style={{
                  backgroundColor: statusColors[ticket.status]?.background || statusColors.OPEN.background,
                  color: statusColors[ticket.status]?.text || statusColors.OPEN.text,
                  border: `1px solid ${statusColors[ticket.status]?.border || statusColors.OPEN.border}`,
                }}
              >
                {ticket.status}
              </Badge>
              <span
                className="inline-block px-3 py-1 rounded-full text-sm"
                style={{
                  fontFamily: FONT_FAMILY.primary,
                  fontSize: BODY_SM.size,
                  lineHeight: BODY_SM.lineHeight,
                  fontWeight: FONT_WEIGHT.medium,
                  letterSpacing: BODY_SM.letterSpacing,
                  color: BODY_TEXT_GREY,
                  backgroundColor: PAGE_BACKGROUND,
                  border: `1px solid ${BORDER_GREY}`,
                }}
              >
                {ticket.category}
              </span>
            </div>
            <p
              className="mt-3 text-sm"
              style={{
                fontFamily: FONT_FAMILY.primary,
                fontSize: BODY_SM.size,
                lineHeight: BODY_SM.lineHeight,
                fontWeight: FONT_WEIGHT.medium,
                letterSpacing: BODY_SM.letterSpacing,
                color: BODY_TEXT_GREY,
              }}
            >
              Updated {ticket.lastUpdated}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}
