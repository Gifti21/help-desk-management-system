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
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Ticket, Plus, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { DARK_GREEN, TEAL_PRIMARY, LIGHT_TEAL_BG, MUTED_GREY_GREEN } from "@/lib/colors";
import { BODY_REGULAR, BODY_SM, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";
import Image from "next/image";

const navItems = [
  { href: "/employee/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employee/tickets", label: "My Tickets", icon: Ticket },
  { href: "/employee/tickets/new", label: "Create Ticket", icon: Plus },
  { href: "/employee/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    // TODO: connect to real logout endpoint
    // Clear local auth state
    localStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('isAuthenticated');
    
    // Navigate to landing page
    router.push('/');
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{ backgroundColor: DARK_GREEN, color: TEAL_PRIMARY }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          width: "280px",
          backgroundColor: DARK_GREEN,
        }}
      >
        <div className="flex h-full flex-col">
          {/* Logo section */}
          <div className="flex flex-col items-center p-6 border-b" style={{ borderColor: "rgba(47, 217, 196, 0.2)" }}>
            <Image
              src="/besys-logo.jpg"
              alt="BESYS Technologies PLC logo"
              width={48}
              height={48}
              className="mb-2"
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
            <span
              className="text-center"
              style={{
                fontFamily: FONT_FAMILY.primary,
                fontSize: BODY_REGULAR.size,
                lineHeight: BODY_REGULAR.lineHeight,
                fontWeight: FONT_WEIGHT.bold,
                letterSpacing: BODY_REGULAR.letterSpacing,
                color: TEAL_PRIMARY,
              }}
            >
              BESYS Support
            </span>
            <span
              className="text-center"
              style={{
                fontFamily: FONT_FAMILY.primary,
                fontSize: BODY_SM.size,
                lineHeight: BODY_SM.lineHeight,
                fontWeight: BODY_SM.weight,
                letterSpacing: BODY_SM.letterSpacing,
                color: MUTED_GREY_GREEN,
              }}
            >
              Employee Portal
            </span>
          </div>

          {/* Nav items */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 transition"
                  style={{
                    backgroundColor: isActive ? LIGHT_TEAL_BG : "transparent",
                    color: isActive ? DARK_GREEN : MUTED_GREY_GREEN,
                  }}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span
                    style={{
                      fontFamily: FONT_FAMILY.primary,
                      fontSize: BODY_REGULAR.size,
                      lineHeight: BODY_REGULAR.lineHeight,
                      fontWeight: isActive ? FONT_WEIGHT.semibold : FONT_WEIGHT.medium,
                      letterSpacing: BODY_REGULAR.letterSpacing,
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t" style={{ borderColor: "rgba(47, 217, 196, 0.2)" }}>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-4 py-3 w-full transition cursor-pointer focus-visible:outline-none focus-visible:ring-2"
              style={{
                color: MUTED_GREY_GREEN,
                backgroundColor: 'rgba(47, 217, 196, 0.08)',
                '--tw-ring-color': TEAL_PRIMARY,
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(47, 217, 196, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(47, 217, 196, 0.08)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
                e.currentTarget.style.backgroundColor = 'rgba(47, 217, 196, 0.25)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'rgba(47, 217, 196, 0.08)';
              }}
            >
              <LogOut className="h-5 w-5" />
              <span
                style={{
                  fontFamily: FONT_FAMILY.primary,
                  fontSize: BODY_REGULAR.size,
                  lineHeight: BODY_REGULAR.lineHeight,
                  fontWeight: FONT_WEIGHT.medium,
                  letterSpacing: BODY_REGULAR.letterSpacing,
                }}
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
