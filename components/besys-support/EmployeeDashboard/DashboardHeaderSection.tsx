import { DARK_GREEN, BODY_TEXT_GREY } from "@/lib/colors";
import { HEADING_LG, BODY_REGULAR, FONT_FAMILY } from "@/lib/fonts";

export function DashboardHeaderSection() {
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
        Dashboard Overview
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
        Welcome back, Jamie. Here&apos;s what&apos;s happening with your tickets.
      </p>
    </div>
  );
}
