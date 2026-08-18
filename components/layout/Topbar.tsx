"use client";

import React from "react";
import { User } from "lucide-react";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useAuth } from "@/hooks/useAuth";
import { MUTED_GREY_GREEN } from "@/lib/colors";
import { fonts, FONT_FAMILY } from "@/lib/fonts";

export const Topbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <header
      style={{
        backgroundColor: "#0F2D2A",
        borderColor: "#1B2D2A",
        fontFamily: FONT_FAMILY.primary,
      }}
      className="flex h-16 items-center justify-between border-b px-4 shadow-sm sm:px-6"
    >
      <div className="flex items-center gap-3">
        <span
          style={{ fontSize: fonts.heading.xs.size, fontWeight: fonts.heading.xs.weight }}
          className="text-white"
        >
          Besys Help Desk
        </span>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />

        <div className="flex items-center gap-3 border-l border-[#1B2D2A] pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1B2D2A] bg-[#111C1A] text-[#2FD9C4]">
            <User className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <p style={{ fontSize: fonts.caption.regular.size }} className="font-semibold text-white">
              {user?.name ?? "Support Agent"}
            </p>
            <p style={{ color: MUTED_GREY_GREEN, fontSize: "10px" }}>Technician Workspace</p>
          </div>
        </div>
      </div>
    </header>
  );
};