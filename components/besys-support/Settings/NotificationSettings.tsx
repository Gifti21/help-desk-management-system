"use client";

import { DARK_GREEN, BODY_TEXT_GREY, BORDER_GREY, PRIMARY_TEXT } from "@/lib/colors";
import { BODY_REGULAR, BODY_SM, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";
import { Card } from "@/components/ui/Card";

interface NotificationSettingsProps {
  notificationsEnabled: boolean;
  onToggle: () => void;
}

export function NotificationSettings({ notificationsEnabled, onToggle }: NotificationSettingsProps) {
  return (
    <Card variant="elevated" className="p-6 mb-6" style={{ borderColor: BORDER_GREY }}>
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
        Notifications
      </h2>
      
      <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: BORDER_GREY }}>
        <div>
          <p
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: BODY_REGULAR.size,
              lineHeight: BODY_REGULAR.lineHeight,
              fontWeight: FONT_WEIGHT.medium,
              letterSpacing: BODY_REGULAR.letterSpacing,
              color: PRIMARY_TEXT,
            }}
          >
            Email Notifications
          </p>
          <p
            className="mt-1"
            style={{
              fontFamily: FONT_FAMILY.primary,
              fontSize: BODY_SM.size,
              lineHeight: BODY_SM.lineHeight,
              fontWeight: BODY_SM.weight,
              letterSpacing: BODY_SM.letterSpacing,
              color: BODY_TEXT_GREY,
            }}
          >
            Receive email updates about your tickets
          </p>
        </div>
        <button
          onClick={onToggle}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition"
          style={{
            backgroundColor: notificationsEnabled ? DARK_GREEN : BORDER_GREY,
          }}
        >
          <span
            className="inline-block h-4 w-4 transform rounded-full bg-white transition"
            style={{
              transform: notificationsEnabled ? "translateX(1.5rem)" : "translateX(0.25rem)",
            }}
          />
        </button>
      </div>
    </Card>
  );
}
