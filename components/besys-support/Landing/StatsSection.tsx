import { TEAL_PRIMARY, DARK_GREEN, MUTED_GREY_GREEN, STATS_GREY } from "@/lib/colors";
import { CAPTION_SMALL, HEADING_XL, HEADING_SM, HEADING_LG, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";

export function StatsSection() {
  return (
    <section className="px-4 py-7 sm:px-6 lg:px-8 lg:py-8" style={{ backgroundColor: DARK_GREEN }}>
      <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 shadow-[0_14px_36px_rgba(0,0,0,0.2)] sm:p-6 lg:p-7">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span className="absolute h-2.5 w-2.5 rounded-full" style={{ backgroundColor: TEAL_PRIMARY, boxShadow: '0 0 0 4px rgba(47, 217, 196, 0.2)' }} />
            <span className="absolute h-4 w-4 rounded-full" style={{ borderColor: 'rgba(47, 217, 196, 0.5)', borderWidth: '1px', borderStyle: 'solid' }} />
          </span>
          <span 
            className="font-semibold uppercase"
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: CAPTION_SMALL.size,
              lineHeight: CAPTION_SMALL.lineHeight,
              fontWeight: CAPTION_SMALL.weight,
              letterSpacing: CAPTION_SMALL.letterSpacing,
              color: MUTED_GREY_GREEN,
            }}
          >
            LIVE SUPPORT STATUS
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <StatCard label="AVG_FIRST_REPLY" value="4" unit="hrs" />
          <StatCard label="RESOLUTION_RATE" value="99" unit="%" />
          <StatCard label="TICKET_TRACKING" value="24" unit="/7" />
          <SystemStatusCard />
        </div>
      </div>
    </section>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  unit: string;
}

function StatCard({ label, value, unit }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p 
        className="font-semibold uppercase"
        style={{
          fontFamily: FONT_FAMILY.mono,
          fontSize: CAPTION_SMALL.size,
          lineHeight: CAPTION_SMALL.lineHeight,
          fontWeight: CAPTION_SMALL.weight,
          letterSpacing: CAPTION_SMALL.letterSpacing,
          color: STATS_GREY,
        }}
      >
        {label}
      </p>
      <p 
        className="mt-2 font-bold leading-none text-white"
        style={{
          fontFamily: FONT_FAMILY.mono,
          fontSize: HEADING_XL.size,
          lineHeight: HEADING_XL.lineHeight,
          fontWeight: FONT_WEIGHT.bold,
          letterSpacing: HEADING_XL.letterSpacing,
        }}
      >
        {value}<span className="ml-1 font-semibold" style={{ fontSize: HEADING_SM.size, color: TEAL_PRIMARY }}>{unit}</span>
      </p>
    </div>
  );
}

function SystemStatusCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p 
        className="font-semibold uppercase"
        style={{
          fontFamily: FONT_FAMILY.mono,
          fontSize: CAPTION_SMALL.size,
          lineHeight: CAPTION_SMALL.lineHeight,
          fontWeight: CAPTION_SMALL.weight,
          letterSpacing: CAPTION_SMALL.letterSpacing,
          color: STATS_GREY,
        }}
      >
        SYSTEM_STATUS
      </p>
      <p 
        className="font-bold uppercase leading-none"
        style={{
          fontFamily: FONT_FAMILY.mono,
          fontSize: HEADING_LG.size,
          lineHeight: HEADING_LG.lineHeight,
          fontWeight: FONT_WEIGHT.bold,
          letterSpacing: HEADING_LG.letterSpacing,
          color: TEAL_PRIMARY,
        }}
      >
        OPERATIONAL
      </p>
    </div>
  );
}
