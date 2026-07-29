"use client";

import Link from "next/link";
import { Search, Bell, HelpCircle } from "lucide-react";
import { DARK_GREEN, TEAL_PRIMARY, INPUT_BORDER, PAGE_BACKGROUND, BODY_TEXT_GREY, BORDER_GREY, PRIMARY_TEXT, LIGHT_TEAL_BG } from "@/lib/colors";
import { INPUT_REGULAR, BODY_REGULAR, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";

interface DashboardHeaderProps {
  userName: string;
  userInitials: string;
}

export function DashboardHeader({ userName, userInitials }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: BORDER_GREY, backgroundColor: PAGE_BACKGROUND }}>
      <div className="flex items-center gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: BODY_TEXT_GREY }} />
          <input
            type="text"
            placeholder="Search tickets..."
            className="w-full rounded-2xl border pl-10 pr-4 py-2.5 outline-none transition focus:ring-2"
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: INPUT_REGULAR.size,
              lineHeight: INPUT_REGULAR.lineHeight,
              fontWeight: INPUT_REGULAR.weight,
              letterSpacing: INPUT_REGULAR.letterSpacing,
              color: PRIMARY_TEXT,
              borderColor: INPUT_BORDER,
              backgroundColor: PAGE_BACKGROUND,
              '--tw-ring-color': TEAL_PRIMARY,
              '--tw-ring-color-light': 'rgba(47, 217, 196, 0.2)',
            } as React.CSSProperties}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/employee/tickets/new">
          <Button variant="primary" size="md">
            + Create Ticket
          </Button>
        </Link>

        <button
          className="p-2 rounded-lg transition focus-visible:outline-none focus-visible:ring-2"
          style={{
            color: BODY_TEXT_GREY,
            '--tw-ring-color': TEAL_PRIMARY,
          } as React.CSSProperties}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = LIGHT_TEAL_BG}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <Bell className="h-5 w-5" />
        </button>

        <button
          className="p-2 rounded-lg transition focus-visible:outline-none focus-visible:ring-2"
          style={{
            color: BODY_TEXT_GREY,
            '--tw-ring-color': TEAL_PRIMARY,
          } as React.CSSProperties}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = LIGHT_TEAL_BG}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <Avatar initials={userInitials} size="md" />
          <span
            className="hidden sm:block"
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: BODY_REGULAR.size,
              lineHeight: BODY_REGULAR.lineHeight,
              fontWeight: FONT_WEIGHT.medium,
              letterSpacing: BODY_REGULAR.letterSpacing,
              color: DARK_GREEN,
            }}
          >
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
}
