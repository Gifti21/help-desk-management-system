"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Settings, LogOut, UserCheck } from "lucide-react";

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Clickable Profile Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none rounded-full ring-2 ring-transparent hover:ring-emerald-500 dark:hover:ring-[#2FD9C4] transition-all"
      >
        <div className="w-9 h-9 rounded-full bg-emerald-600 dark:bg-[#2FD9C4] text-white dark:text-[#0C1815] font-bold flex items-center justify-center text-sm shadow-sm">
          B
        </div>
      </button>

      {/* Popup Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0C1815] border border-slate-200 dark:border-[#1E3E35] rounded-xl shadow-lg py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-[#1E3E35]">
            <p className="font-semibold text-slate-900 dark:text-white">Bontu</p>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">bontu@besystech.com</p>
          </div>

          <div className="py-1">
            <Link
              href="/dashboard/technician/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1E3E35] transition-colors"
            >
              <Settings className="w-4 h-4 text-emerald-600 dark:text-[#2FD9C4]" />
              <span>Workspace Settings</span>
            </Link>
          </div>

          <div className="border-t border-slate-100 dark:border-[#1E3E35] py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                // Add your logout logic here
                window.location.href = "/login";
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}