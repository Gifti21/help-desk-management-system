"use client";

import { Bell, Shield, ChevronRight } from "lucide-react";
import { DARK_GREEN, BODY_TEXT_GREY, BORDER_GREY, PRIMARY_TEXT, SECONDARY_BACKGROUND, PAGE_BACKGROUND } from "@/lib/colors";
import { BODY_REGULAR, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";
import { Card } from "@/components/ui/Card";

interface QuickActionsProps {
  onChangePassword: () => void;
  onNotificationPreferences: () => void;
}

export function QuickActions({ onChangePassword, onNotificationPreferences }: QuickActionsProps) {
  return (
    <Card variant="elevated" className="p-6" style={{ borderColor: BORDER_GREY }}>
      <h2
        className="mb-6"
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: "1.25rem",
          lineHeight: "1.5",
          fontWeight: 600,
          letterSpacing: "0.01em",
          color: DARK_GREEN,
        }}
      >
        Quick Actions
      </h2>
      
      <div className="space-y-3">
        <button
          onClick={onChangePassword}
          className="w-full flex items-center justify-between p-4 rounded-xl transition"
          style={{ backgroundColor: PAGE_BACKGROUND }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = SECONDARY_BACKGROUND}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = PAGE_BACKGROUND}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: SECONDARY_BACKGROUND }}
            >
              <Shield className="h-5 w-5" style={{ color: DARK_GREEN }} />
            </div>
            <span
              style={{
                fontFamily: FONT_FAMILY.primary,
                fontSize: BODY_REGULAR.size,
                lineHeight: BODY_REGULAR.lineHeight,
                fontWeight: FONT_WEIGHT.medium,
                letterSpacing: BODY_REGULAR.letterSpacing,
                color: PRIMARY_TEXT,
              }}
            >
              Change Password
            </span>
          </div>
          <ChevronRight className="h-5 w-5" style={{ color: BODY_TEXT_GREY }} />
        </button>

        <button
          onClick={onNotificationPreferences}
          className="w-full flex items-center justify-between p-4 rounded-xl transition"
          style={{ backgroundColor: PAGE_BACKGROUND }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = SECONDARY_BACKGROUND}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = PAGE_BACKGROUND}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: SECONDARY_BACKGROUND }}
            >
              <Bell className="h-5 w-5" style={{ color: DARK_GREEN }} />
            </div>
            <span
              style={{
                fontFamily: FONT_FAMILY.primary,
                fontSize: BODY_REGULAR.size,
                lineHeight: BODY_REGULAR.lineHeight,
                fontWeight: FONT_WEIGHT.medium,
                letterSpacing: BODY_REGULAR.letterSpacing,
                color: PRIMARY_TEXT,
              }}
            >
              Notification Preferences
            </span>
          </div>
          <ChevronRight className="h-5 w-5" style={{ color: BODY_TEXT_GREY }} />
        </button>
      </div>
    </Card>
  );
}
