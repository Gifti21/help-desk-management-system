"use client";

import { DARK_GREEN, BORDER_GREY, BODY_TEXT_GREY, SECONDARY_BACKGROUND, LIGHT_BORDER, TEAL_PRIMARY } from "@/lib/colors";
import { BODY_LG, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const allPartners = [
  "Huawei",
  "Microsoft",
  "Cisco",
  "HPE",
  "Fortinet",
  "Dell",
  "Lenovo",
  "Hikvision",
  "IBM",
  "ManageEngine",
  "Solarwinds",
  "Oracle",
  "Array Networks",
  "Ruckus",
  "Vertiv",
  "CyberArk",
  "Epson",
  "Canon",
  "ZkTeco",
  "Sophos",
  "itc",
  "Mitel",
  "Zebra",
];

export function PartnersSection() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        const newPosition = prev + 0.5;
        const partnerWidth = 160; // Approximate width including gap
        const totalWidth = partnerWidth * allPartners.length;
        // Reset to 0 when we reach the first set (seamless loop)
        return newPosition >= totalWidth ? 0 : newPosition;
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleScrollLeft = () => {
    setIsPaused(true);
    setScrollPosition((prev) => {
      const newPosition = prev - 160;
      return newPosition < 0 ? 0 : newPosition;
    });
    
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => setIsPaused(false), 500);
  };

  const handleScrollRight = () => {
    setIsPaused(true);
    setScrollPosition((prev) => {
      const partnerWidth = 160;
      const totalWidth = partnerWidth * allPartners.length;
      const newPosition = prev + 160;
      return newPosition >= totalWidth ? 0 : newPosition;
    });
    
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => setIsPaused(false), 500);
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Duplicate partners array for infinite scroll effect
  const displayPartners = [...allPartners, ...allPartners];

  return (
    <section className="border-t px-4 py-8 text-center sm:px-6 lg:px-8" style={{ borderColor: BORDER_GREY, backgroundColor: SECONDARY_BACKGROUND }}>
      <div className="mx-auto max-w-7xl">
        {/* Label - centered above carousel */}
        <div 
          className="mb-6 text-center"
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: "1.125rem",
            lineHeight: "1.4",
            fontWeight: FONT_WEIGHT.semibold,
            letterSpacing: "0.05em",
            color: DARK_GREEN,
          }}
        >
          <span className="font-semibold uppercase">PARTNERING WITH</span>
        </div>

        {/* Carousel Row */}
        <div className="flex items-center justify-center gap-4">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={handleScrollLeft}
            className="flex items-center justify-center rounded-full border bg-white cursor-pointer hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ 
              borderColor: TEAL_PRIMARY, 
              color: TEAL_PRIMARY,
              border: `1px solid ${TEAL_PRIMARY}`,
              "--tw-ring-color": TEAL_PRIMARY,
              width: "48px",
              height: "48px",
            } as React.CSSProperties}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Carousel Container */}
          <div 
            className="flex-1 overflow-hidden"
            style={{ maxWidth: "calc(100% - 120px)" }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div
              ref={carouselRef}
              className="flex gap-4 transition-transform"
              style={{
                transform: `translateX(-${scrollPosition}px)`,
                width: `${displayPartners.length * 160}px`,
              }}
            >
              {displayPartners.map((partner, index) => (
                <span 
                  key={`${partner}-${index}`} 
                  className="rounded-full border bg-white px-6 py-3 whitespace-nowrap flex-shrink-0"
                  style={{ 
                    borderColor: "#e3e5e2", 
                    color: BODY_TEXT_GREY,
                    width: "140px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONT_FAMILY.primary,
                    fontSize: BODY_LG.size,
                    fontWeight: FONT_WEIGHT.medium,
                  }}
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={handleScrollRight}
            className="flex items-center justify-center rounded-full border bg-white cursor-pointer hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ 
              borderColor: TEAL_PRIMARY, 
              color: TEAL_PRIMARY,
              border: `1px solid ${TEAL_PRIMARY}`,
              "--tw-ring-color": TEAL_PRIMARY,
              width: "48px",
              height: "48px",
            } as React.CSSProperties}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
