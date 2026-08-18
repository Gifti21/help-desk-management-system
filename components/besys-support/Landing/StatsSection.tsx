import { TEAL_PRIMARY, DARK_GREEN, MUTED_GREY_GREEN } from "@/lib/colors";
import { CAPTION_SMALL, FONT_FAMILY } from "@/lib/fonts";
import { useEffect, useRef } from "react";
import { SystemStatusCard } from "./StatsSection/SystemStatusCard";
import { ResolutionRateCard } from "./StatsSection/ResolutionRateCard";
import { TicketTrackingCard } from "./StatsSection/TicketTrackingCard";

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = section.querySelectorAll('.stats-card');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-in');
              }, index * 80);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="px-2 py-3 sm:px-3 lg:px-4 lg:py-4" style={{ backgroundColor: DARK_GREEN }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-2 rounded-[20px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-3 shadow-[0_10px_28px_rgba(0,0,0,0.2)] sm:p-4 lg:p-4">
        <SectionHeader />
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
          <SystemStatusCard />
          <ResolutionRateCard />
          <TicketTrackingCard />
        </div>
      </div>
    </section>
  );
}

function SectionHeader() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2 items-center justify-center">
        <span className="absolute h-2 w-2 rounded-full pulse-dot" style={{ backgroundColor: TEAL_PRIMARY }} />
        <span className="absolute h-3 w-3 rounded-full pulse-ring" style={{ borderColor: 'rgba(47, 217, 196, 0.5)', borderWidth: '1px', borderStyle: 'solid' }} />
      </span>
      <span 
        className="font-semibold uppercase"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: '0.6rem',
          lineHeight: CAPTION_SMALL.lineHeight,
          fontWeight: CAPTION_SMALL.weight,
          letterSpacing: CAPTION_SMALL.letterSpacing,
          color: MUTED_GREY_GREEN,
        }}
      >
        LIVE SUPPORT STATUS
      </span>
    </div>
  );
}
