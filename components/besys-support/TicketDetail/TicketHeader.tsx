import { DARK_GREEN, PAGE_BACKGROUND, BORDER_GREY, BODY_TEXT_GREY } from "@/lib/colors";
import { BODY_XL, BODY_SM, BODY_REGULAR, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StepProgress } from "@/components/ui/StepProgress";
import { statusColors, priorityColors } from "@/lib/utils/ticket-colors";
import type { Ticket } from "@/lib/types/ticket";

interface TicketHeaderProps {
  ticket: Ticket;
}

export function TicketHeader({ ticket }: TicketHeaderProps) {
  return (
    <Card variant="elevated" className="p-6 mb-6" style={{ borderColor: BORDER_GREY }}>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
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
            </span>
            <Badge
              style={{
                backgroundColor: statusColors[ticket.status].background,
                color: statusColors[ticket.status].text,
                border: `1px solid ${statusColors[ticket.status].border}`,
              }}
            >
              {ticket.status}
            </Badge>
          </div>
          <h1
            className="mb-3"
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: BODY_XL.size,
              lineHeight: BODY_XL.lineHeight,
              fontWeight: FONT_WEIGHT.bold,
              letterSpacing: BODY_XL.letterSpacing,
              color: DARK_GREEN,
            }}
          >
            {ticket.title}
          </h1>
          <div className="flex flex-wrap gap-2">
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
            <Badge
              style={{
                backgroundColor: priorityColors[ticket.priority].background,
                color: priorityColors[ticket.priority].text,
                border: `1px solid ${priorityColors[ticket.priority].border}`,
              }}
            >
              {ticket.priority} Priority
            </Badge>
          </div>
        </div>
        <p
          className="text-sm"
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: BODY_SM.size,
            lineHeight: BODY_SM.lineHeight,
            fontWeight: FONT_WEIGHT.medium,
            letterSpacing: BODY_SM.letterSpacing,
            color: BODY_TEXT_GREY,
          }}
        >
          Created {ticket.createdAt}
        </p>
      </div>

      {/* Step Progress */}
      <div className="pt-6 border-t" style={{ borderColor: BORDER_GREY }}>
        <StepProgress currentStatus={ticket.status} />
      </div>
    </Card>
  );
}
