"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";

const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'Ticket TICK-1024 updated', time: '2h ago' },
  { id: 'n2', title: 'New comment on TICK-1028', time: '5h ago' },
  { id: 'n3', title: 'Priority escalated: TICK-0992', time: '1d ago' },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setOpen((s) => !s)}
        className="relative p-2 rounded-md hover:bg-slate-100 dark:hover:bg-[#1B2D2A] text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-0.5 right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full">
          {MOCK_NOTIFICATIONS.length}
        </span>
      </button>

      {/* Popover Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#111C1A] border border-slate-200 dark:border-[#1B2D2A] rounded-lg shadow-xl z-50">
          <div className="p-3">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-[#1B2D2A]">
              Notifications
            </h4>
            
            <ul className="mt-2 space-y-1 max-h-60 overflow-auto">
              {MOCK_NOTIFICATIONS.map((n) => (
                <li 
                  key={n.id} 
                  className="text-sm p-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#1B2D2A] transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-slate-900 dark:text-slate-200 truncate">
                      {n.title}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-teal-300/60 shrink-0">
                      {n.time}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-[#1B2D2A] text-right">
              <a 
                href="/dashboard/notifications" 
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
              >
                View all
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}