"use client";

import Image from "next/image";
import { colors } from "@/lib/colors";

export function Footer() {
  return (
    <footer
      className="border-t py-3 px-4 transition-colors"
      style={{
        backgroundColor: colors.darkGreen,
        borderColor: "rgba(47, 217, 196, 0.2)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image
            src="/besys_logo.webp"
            alt="BESYS Logo"
            width={20}
            height={20}
            className="rounded"
          />
          <span
            className="font-semibold text-sm"
            style={{
              color: colors.tealPrimary,
            }}
          >
            BESYS TECHNOLOGIES PLC
          </span>
        </div>

        <div
          className="text-xs"
          style={{
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          © 2026. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
