import { TEAL_PRIMARY, STATS_GREY } from "@/lib/colors";
import { CAPTION_SMALL, HEADING_XL, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";
import { WaveGraph } from "./WaveGraph";
import { MonitoringPill } from "./MonitoringPill";

export function SystemStatusCard() {
  return (
    <div className="stats-card rounded-xl border border-white/10 bg-white/5 p-3">
      <CardLabel>System Status</CardLabel>
      <div className="mt-2">
        <StatusText text="All systems" color="white" />
        <StatusText text="operational." color={TEAL_PRIMARY} />
      </div>
      <WaveGraph />
      <MonitoringPill />
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

function StatusText({ text, color }: { text: string; color: string }) {
  return (
    <p
      className="font-bold leading-tight"
      style={{
        fontFamily: FONT_FAMILY.primary,
        fontSize: '1rem',
        lineHeight: HEADING_XL.lineHeight,
        fontWeight: FONT_WEIGHT.bold,
        letterSpacing: HEADING_XL.letterSpacing,
        color: color,
      }}
    >
      {text}
    </p>
  );
}
