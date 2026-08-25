import { DARK_GREEN, BODY_TEXT_GREY } from "@/lib/colors";
import { HEADING_LG, BODY_REGULAR, FONT_FAMILY } from "@/lib/fonts";

export function MyTicketsHeaderSection() {
  return (
    <div className="mb-8">
      <h1
        className="mb-2"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: HEADING_LG.size,
          lineHeight: HEADING_LG.lineHeight,
          fontWeight: HEADING_LG.weight,
          letterSpacing: HEADING_LG.letterSpacing,
          color: DARK_GREEN,
        }}
      >
        My Tickets
      </h1>
      <p
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: BODY_REGULAR.size,
          lineHeight: BODY_REGULAR.lineHeight,
          fontWeight: BODY_REGULAR.weight,
          letterSpacing: BODY_REGULAR.letterSpacing,
          color: BODY_TEXT_GREY,
        }}
      >
        View and manage all your support tickets.
      </p>
    </div>
  );
}
