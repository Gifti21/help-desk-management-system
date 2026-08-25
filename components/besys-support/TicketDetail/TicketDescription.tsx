import { DARK_GREEN, BORDER_GREY, PRIMARY_TEXT } from "@/lib/colors";
import { HEADING_LG, BODY_REGULAR, FONT_FAMILY } from "@/lib/fonts";
import { Card } from "@/components/ui/card";
import type { Ticket } from "@/lib/types/ticket";

interface TicketDescriptionProps {
  ticket: Ticket;
}

export function TicketDescription({ ticket }: TicketDescriptionProps) {
  return (
    <Card
      variant="elevated"
      className="p-6 mb-6"
      style={{ borderColor: BORDER_GREY }}
    >
      <h2
        className="mb-3"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: HEADING_LG.size,
          lineHeight: HEADING_LG.lineHeight,
          fontWeight: HEADING_LG.weight,
          letterSpacing: HEADING_LG.letterSpacing,
          color: DARK_GREEN,
        }}
      >
        Description
      </h2>
      <p
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: BODY_REGULAR.size,
          lineHeight: BODY_REGULAR.lineHeight,
          fontWeight: BODY_REGULAR.weight,
          letterSpacing: BODY_REGULAR.letterSpacing,
          color: PRIMARY_TEXT,
        }}
      >
        {ticket.description}
      </p>
    </Card>
  );
}
