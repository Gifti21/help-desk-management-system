import { TEAL_PRIMARY } from "@/lib/colors";
import { BODY_SM, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";

export function MonitoringPill() {
  return (
    <div className="flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-2 py-1">
      <span className="relative flex h-1.5 w-1.5 items-center justify-center">
        <span className="absolute h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" style={{ backgroundColor: TEAL_PRIMARY }} />
        <span className="absolute h-1.5 w-1.5 rounded-full" style={{ backgroundColor: TEAL_PRIMARY, boxShadow: '0 0 0 3px rgba(47, 217, 196, 0.3)' }} />
      </span>
      <p
        className="text-xs font-medium"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: '0.7rem',
          lineHeight: BODY_SM.lineHeight,
          fontWeight: BODY_SM.weight,
          letterSpacing: BODY_SM.letterSpacing,
          color: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        Monitoring active
      </p>
    </div>
  );
}
