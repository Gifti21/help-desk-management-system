"use client";

import React, { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Inbox, 
  Bell, 
  BarChart2, 
  HelpCircle, 
  Settings, 
  LogOut
} from 'lucide-react';
import { useTickets } from '@/context/TicketContext';
import { DARK_GREEN, BORDER_GREY, TEAL_PRIMARY } from '@/lib/colors';

interface SidebarProps {
  onLogout?: () => void;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard/technician", icon: LayoutDashboard },
  { label: "Assigned Tickets", href: "/dashboard/technician/queue", icon: Inbox },
  { label: "Notifications", href: "/dashboard/technician/notifications", icon: Bell },
  { label: "Reports", href: "/dashboard/technician/reports", icon: BarChart2 },
  { label: "Help Center", href: "/dashboard/technician/help", icon: HelpCircle },
  { label: "Settings", href: "/dashboard/technician/settings", icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const pathname = usePathname();
  const { unreadNotificationsCount } = useTickets();

  return (
    <aside 
      style={{ backgroundColor: DARK_GREEN }}
      className="w-full md:w-64 border-r md:h-screen md:sticky md:top-0 flex flex-col p-4 justify-between select-none"
    >
      {/* Top Section: Brand Header & Navigation */}
      <div className="flex flex-col flex-1 min-h-0 space-y-4">
        
        {/* Logo Header */}
        <div 
          style={{ borderColor: BORDER_GREY }}
          className="flex items-center gap-3 px-2 py-2 border-b"
        >
          <div className="relative w-9 h-9 shrink-0 rounded-full overflow-hidden border border-[#2FD9C4]/40 bg-[#0A1C18]">
            <Image
              src="/besys_logo.webp"
              alt="Besys Technologies Logo"
              fill
              className="object-cover rounded-full"
              priority
            />
          </div>
          <div className="min-w-0">
            <span className="font-extrabold text-sm text-white tracking-tight truncate block">
              Besys Technologies
            </span>
            <span style={{ color: TEAL_PRIMARY }} className="text-[10px] font-mono font-bold block uppercase tracking-wider">
              Support Agent HDMS
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 overflow-y-auto flex-1 pr-1 pt-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  backgroundColor: isActive ? TEAL_PRIMARY : undefined,
                  color: isActive ? DARK_GREEN : undefined,
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? "font-bold shadow-md shadow-[#2FD9C4]/10"
                    : "text-slate-300 hover:text-white hover:bg-[#193831]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>

                {item.label === "Notifications" && unreadNotificationsCount > 0 && (
                  <span 
                    style={{
                      backgroundColor: isActive ? DARK_GREEN : TEAL_PRIMARY,
                      color: isActive ? TEAL_PRIMARY : DARK_GREEN,
                    }}
                    className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  >
                    {unreadNotificationsCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer: Logout Button Only */}
      <div 
        style={{ borderColor: BORDER_GREY }}
        className="pt-3 border-t mt-auto"
      >
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/40 py-2 px-3 rounded-lg transition-colors group cursor-pointer"
          title="Sign out of session"
        >
          <LogOut className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};