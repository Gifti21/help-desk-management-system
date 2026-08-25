"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Bell,
  BarChart2,
  HelpCircle,
  Settings,
  LogOut,
  Ticket,
  Plus,
  Menu,
  X,
} from "lucide-react";
import {
  DARK_GREEN,
  BORDER_GREY,
  TEAL_PRIMARY,
  LIGHT_TEAL_BG,
  MUTED_GREY_GREEN,
} from "@/lib/colors";
import { BODY_REGULAR, BODY_SM, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";

interface SidebarProps {
  onLogout?: () => void;
  role?: "EMPLOYEE" | "TECHNICIAN" | "ADMIN";
}

export function Sidebar({ onLogout, role = "TECHNICIAN" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems =
    role === "EMPLOYEE"
      ? [
          {
            label: "Dashboard",
            href: "/employee/dashboard",
            icon: LayoutDashboard,
          },
          { label: "My Tickets", href: "/employee/tickets", icon: Ticket },
          { label: "Create Ticket", href: "/employee/tickets/new", icon: Plus },
          { label: "Settings", href: "/employee/settings", icon: Settings },
        ]
      : [
          {
            label: "Dashboard",
            href: "/dashboard/technician",
            icon: LayoutDashboard,
          },
          {
            label: "Assigned Tickets",
            href: "/dashboard/technician/queue",
            icon: Inbox,
          },
          {
            label: "Notifications",
            href: "/dashboard/technician/notifications",
            icon: Bell,
          },
          {
            label: "Reports",
            href: "/dashboard/technician/reports",
            icon: BarChart2,
          },
          {
            label: "Help Center",
            href: "/dashboard/technician/help",
            icon: HelpCircle,
          },
          {
            label: "Settings",
            href: "/dashboard/technician/settings",
            icon: Settings,
          },
        ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("isAuthenticated");
      router.push("/");
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{ backgroundColor: DARK_GREEN, color: TEAL_PRIMARY }}
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
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
          {/* Logo Header */}
          <div
            style={{ borderColor: BORDER_GREY }}
            className="flex items-center gap-3 px-6 py-4 border-b"
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
              <span
                style={{ color: TEAL_PRIMARY }}
                className="text-[10px] font-mono font-bold block uppercase tracking-wider"
              >
                Support HDMS
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    backgroundColor: isActive ? TEAL_PRIMARY : undefined,
                    color: isActive ? DARK_GREEN : MUTED_GREY_GREEN,
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? "font-bold shadow-md shadow-[#2FD9C4]/10"
                      : "hover:text-white hover:bg-[#193831]"
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer: Logout Button */}
          <div style={{ borderColor: BORDER_GREY }} className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-rose-300 hover:text-white bg-rose-950/30 hover:bg-rose-900/50 border border-rose-900/40 py-3 px-4 rounded-lg transition-colors group cursor-pointer"
              title="Sign out of session"
            >
              <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
