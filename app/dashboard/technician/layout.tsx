"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { TicketProvider, useTickets } from "@/context/TicketContext";
import { Menu, X, Bell } from "lucide-react";
import { ProfileDropdown } from "@/components/ui/ProfileDropdown";

function LayoutHeaderContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { unreadNotificationsCount } = useTickets();

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#E2E8F0] sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 shrink-0 rounded-full overflow-hidden border border-emerald-300">
            <Image
              src="/besys_logo.webp"
              alt="Besys Logo"
              fill
              className="object-cover rounded-full"
            />
          </div>
          <span className="font-extrabold text-sm text-[#0E2621] tracking-wide">Besys HDMS</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg bg-slate-100 border border-slate-200 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#0E2621] p-4 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex justify-between items-center mb-6 border-b border-[#193831] pb-4">
              <span className="font-bold text-[#2FD9C4] font-mono">Besys Navigation</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-slate-300" />
              </button>
            </div>
            <div onClick={() => setMobileMenuOpen(false)}>
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Header Bar */}
      <header className="hidden md:flex h-16 border-b border-[#E2E8F0] bg-white px-6 items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#0E2621] uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            Support Agent Workspace &mdash; Bontu
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/technician/notifications"
            className="relative p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2FD9C4] text-[#0E2621] font-bold text-[10px] rounded-full flex items-center justify-center border border-[#0E2621]">
                {unreadNotificationsCount}
              </span>
            )}
          </Link>

          {/* Interactive Profile Dropdown Component */}
          <div className="border-l border-slate-200 pl-3">
            <ProfileDropdown />
          </div>
        </div>
      </header>
    </>
  );
}

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  return (
    <TicketProvider>
      <div className="min-h-screen bg-[#F4F7F6] text-slate-900 flex flex-col md:flex-row font-sans">
        
        {/* Desktop Sidebar - Signature dark forest green */}
        <div className="hidden md:block bg-[#0E2621] shrink-0 border-r border-[#193831]">
          <Sidebar />
        </div>

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <LayoutHeaderContent />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </TicketProvider>
  );
}