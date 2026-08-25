import Link from "next/link";
import { Plus } from "lucide-react";
import { DARK_GREEN, BODY_TEXT_GREY, TEAL_PRIMARY } from "@/lib/colors";
import { HEADING_LG, BODY_REGULAR, FONT_FAMILY } from "@/lib/fonts";

export function MyTicketsHeaderSection() {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1
          className="mb-2"
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: HEADING_LG.size,
            lineHeight: HEADING_LG.lineHeight,
            fontWeight: HEADING_LG.weight,
            letterSpacing: HEADING_LG.letterSpacing,
            color: DARK_GREEN,
          }}
        >
          My Tickets
        </h1>
        <p
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: BODY_REGULAR.size,
            lineHeight: BODY_REGULAR.lineHeight,
            fontWeight: BODY_REGULAR.weight,
            letterSpacing: BODY_REGULAR.letterSpacing,
            color: BODY_TEXT_GREY,
          }}
        >
          View and manage all your support tickets.
        </p>
      </div>

      <Link
        href="/employee/tickets/new"
        className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
        style={{
          backgroundColor: TEAL_PRIMARY,
          color: DARK_GREEN,
        }}
      >
        <Plus className="h-4 w-4" />
        Create Ticket
      </Link>
    </div>
  );
}
