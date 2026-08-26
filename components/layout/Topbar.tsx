"use client";

import React from "react";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ProfileDropdown } from "@/components/ui/ProfileDropdown";

export const Topbar: React.FC = () => {
  return (
    <header className="flex h-14.5 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm sm:px-6">
      <div className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-emerald-800">
        Support Agent Workspace&nbsp;&mdash;&nbsp;Bontu
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />
        <ProfileDropdown />
      </div>
    </header>
  );
};
