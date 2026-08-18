import { TEAL_PRIMARY, STATS_GREY } from "@/lib/colors";
import { CAPTION_SMALL, HEADING_LG, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";

export function TicketTrackingCard() {
  return (
    <div className="stats-card col-span-1 md:col-span-2 rounded-xl border border-white/10 bg-white/5 p-3">
      <CardLabel>Ticket Tracking</CardLabel>
      <p
        className="mt-2 font-bold leading-tight"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: '0.9375rem',
          lineHeight: HEADING_LG.lineHeight,
          fontWeight: FONT_WEIGHT.bold,
          letterSpacing: HEADING_LG.letterSpacing,
        }}
      >
        <span className="text-white">24/7</span>{' '}
        <span style={{ color: TEAL_PRIMARY }}>coverage, always on.</span>
      </p>
    </div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-semibold uppercase"
      style={{
        fontFamily: FONT_FAMILY.mono,
        fontSize: '0.6rem',
        lineHeight: CAPTION_SMALL.lineHeight,
        fontWeight: CAPTION_SMALL.weight,
        letterSpacing: CAPTION_SMALL.letterSpacing,
        color: STATS_GREY,
      }}
    >
      {children}
    </p>
  );
}
