import { TEAL_PRIMARY, STATS_GREY } from "@/lib/colors";
import { CAPTION_SMALL, HEADING_XL, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";
import { ProgressRing } from "@/components/ui/ProgressRing";

export function ResolutionRateCard() {
  return (
    <div className="stats-card relative rounded-xl border border-white/10 bg-white/5 p-3">
      <ProgressRing percentage={99} size={28} strokeWidth={2} className="absolute right-2 top-2" />
      <CardLabel>Resolution Rate</CardLabel>
      <p
        className="mt-2 font-bold leading-none text-white"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: '1rem',
          lineHeight: HEADING_XL.lineHeight,
          fontWeight: FONT_WEIGHT.bold,
          letterSpacing: HEADING_XL.letterSpacing,
        }}
      >
        99<span className="ml-1 font-semibold" style={{ fontSize: '0.75rem', color: TEAL_PRIMARY }}>%</span>
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
