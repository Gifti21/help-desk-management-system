"use client";

import { DARK_GREEN } from "@/lib/colors";
import { BODY_SM, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";

interface SuccessToastProps {
  message: string;
}

export function SuccessToast({ message }: SuccessToastProps) {
  return (
    <div
      className="fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
      style={{
        backgroundColor: DARK_GREEN,
        color: "white",
        fontFamily: FONT_FAMILY.primary,
        fontSize: BODY_SM.size,
        fontWeight: FONT_WEIGHT.medium,
      }}
    >
      {message}
    </div>
  );
}
