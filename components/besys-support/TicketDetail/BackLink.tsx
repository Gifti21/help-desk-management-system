import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TEAL_PRIMARY, TEAL_HOVER } from "@/lib/colors";
import { BODY_REGULAR, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";

export function BackLink() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/employee/tickets")}
      className="mb-6 flex items-center gap-2 transition focus-visible:outline-none focus-visible:ring-2"
      style={{
        fontFamily: FONT_FAMILY.primary,
        fontSize: BODY_REGULAR.size,
        lineHeight: BODY_REGULAR.lineHeight,
        fontWeight: FONT_WEIGHT.semibold,
        letterSpacing: BODY_REGULAR.letterSpacing,
        color: TEAL_PRIMARY,
        '--tw-ring-color': TEAL_PRIMARY,
      } as React.CSSProperties}
      onMouseEnter={(e) => e.currentTarget.style.color = TEAL_HOVER}
      onMouseLeave={(e) => e.currentTarget.style.color = TEAL_PRIMARY}
    >
      <ArrowLeft className="h-4 w-4" />
      Back to My Tickets
    </button>
  );
}
