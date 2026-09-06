"use client";

import React from "react";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { ProfileDropdown } from "@/components/ui/ProfileDropdown";
import { useAuth } from "@/hooks/useAuth";

export const Topbar: React.FC = () => {
  const { user } = useAuth();
  const agentName = user?.name || "Support Agent";

  return (
    <header className="flex min-h-14.5 flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-3 shadow-sm sm:px-6">
      <div className="min-w-0 max-w-[calc(100%-7rem)] rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-800 sm:max-w-none sm:px-3 sm:text-[11px]">
        <span className="block truncate">
          Support Agent Workspace&nbsp;&mdash;&nbsp;{agentName}
        </span>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
        <NotificationBell />
        <ProfileDropdown />
      </div>
    </header>
  );
};
