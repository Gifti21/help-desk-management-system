import { TEAL_PRIMARY, DARK_GREEN, LIGHT_TEAL_BG } from "@/lib/colors";
import { BODY_REGULAR, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: { width: "32px", height: "32px", fontSize: "12px" },
  md: { width: "40px", height: "40px", fontSize: "14px" },
  lg: { width: "48px", height: "48px", fontSize: "16px" },
};

export function Avatar({ initials, size = "md", className = "" }: AvatarProps) {
  const style = sizeStyles[size];

  return (
    <div
      className={`flex items-center justify-center rounded-full ${className}`}
      style={{
        width: style.width,
        height: style.height,
        backgroundColor: LIGHT_TEAL_BG,
        color: DARK_GREEN,
        fontFamily: FONT_FAMILY.primary,
        fontSize: style.fontSize,
        lineHeight: style.fontSize,
        fontWeight: FONT_WEIGHT.semibold,
        letterSpacing: BODY_REGULAR.letterSpacing,
      }}
    >
      {initials}
    </div>
  );
}
