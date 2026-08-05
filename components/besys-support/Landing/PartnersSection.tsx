"use client";

import { DARK_GREEN, BORDER_GREY, BODY_TEXT_GREY, SECONDARY_BACKGROUND, LIGHT_BORDER, TEAL_PRIMARY } from "@/lib/colors";
import { BODY_LG, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const featuredPartners = ["Huawei", "Microsoft"];
const additionalPartners = [
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
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="border-t px-4 py-8 text-center sm:px-6 lg:px-8" style={{ borderColor: BORDER_GREY, backgroundColor: SECONDARY_BACKGROUND }}>
      <div className="mx-auto max-w-7xl">
        {/* Featured Partners Row */}
        <div 
          className="flex flex-wrap items-center justify-center gap-4 font-semibold uppercase mb-0"
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: BODY_LG.size,
            lineHeight: BODY_LG.lineHeight,
            fontWeight: FONT_WEIGHT.semibold,
            letterSpacing: BODY_LG.letterSpacing,
            color: BODY_TEXT_GREY,
          }}
        >
          <span>PARTNERING WITH</span>
          {featuredPartners.map((partner) => (
            <span key={partner} className="rounded-full border bg-white px-6 py-3" style={{ borderColor: "#e3e5e2", color: "#0f2a2e" }}>
              {partner}
            </span>
          ))}
          {/* Toggle Button - Always teal border and text */}
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 cursor-pointer hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ 
              borderColor: TEAL_PRIMARY, 
              color: TEAL_PRIMARY,
              backgroundColor: "white",
              border: `1px solid ${TEAL_PRIMARY}`,
              "--tw-ring-color": TEAL_PRIMARY
            } as React.CSSProperties}
          >
            <span style={{ fontFamily: FONT_FAMILY.primary, fontSize: BODY_LG.size, fontWeight: FONT_WEIGHT.semibold, letterSpacing: BODY_LG.letterSpacing }}>
              {showAll ? "Show Less" : "+ More"}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Expanded Partners Panel */}
        {showAll && (
          <div 
            className="mt-6 rounded-2xl border p-6"
            style={{ 
              backgroundColor: "#ffffff", 
              borderColor: "#e3e5e2",
              borderRadius: "16px"
            }}
          >
            <div 
              className="grid gap-3"
              style={{ 
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" 
              }}
            >
              {additionalPartners.map((partner) => (
                <div
                  key={partner}
                  className="flex items-center justify-center rounded-lg border px-4 py-3"
                  style={{ 
                    borderColor: "#e3e5e2", 
                    backgroundColor: "#f4f5f4",
                    color: "#0f2a2e"
                  }}
                >
                  <span 
                    className="font-semibold uppercase text-sm"
                    style={{
                      fontFamily: FONT_FAMILY.primary,
                      fontSize: "0.875rem",
                      fontWeight: FONT_WEIGHT.semibold,
                      letterSpacing: BODY_LG.letterSpacing,
                    }}
                  >
                    {partner}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
