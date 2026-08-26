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
  MoreHorizontal,
} from "lucide-react";
import {
  DARK_GREEN,
  BORDER_GREY,
  TEAL_PRIMARY,
  MUTED_GREY_GREEN,
  LIGHT_TEAL_BG,
} from "@/lib/colors";

interface SidebarProps {
  onLogout?: () => void;
  role?: "EMPLOYEE" | "TECHNICIAN" | "ADMIN";
}

export function Sidebar({ onLogout, role = "TECHNICIAN" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

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

  const mainItems = navItems.slice(0, 4);
  const moreItems = navItems.slice(4);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("isAuthenticated");
      router.push("/");
    }
  };

  const navButtonStyle = (isActive: boolean) => ({
    backgroundColor: isActive ? TEAL_PRIMARY : "transparent",
    color: isActive ? DARK_GREEN : MUTED_GREY_GREEN,
  });

  return (
    <>
      <aside
        className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:z-40 lg:w-64"
        style={{ backgroundColor: DARK_GREEN }}
      >
        <div className="flex h-full flex-col">
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
                {role === "EMPLOYEE" ? "Employee Portal" : "Support HDMS"}
              </span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  style={navButtonStyle(isActive)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? "font-bold shadow-md shadow-[#2FD9C4]/10"
                      : "hover:text-white hover:bg-[#193831]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

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

      <div className="hidden md:block lg:hidden">
        <div
          className="fixed inset-x-0 top-0 z-40"
          style={{
            backgroundColor: DARK_GREEN,
            borderBottom: `1px solid ${BORDER_GREY}`,
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: `1px solid ${BORDER_GREY}` }}
          >
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#2FD9C4]/40 bg-[#0A1C18]">
                <Image
                  src="/besys_logo.webp"
                  alt="Besys Logo"
                  fill
                  className="object-cover rounded-full"
                  priority
                />
              </div>
              <span className="text-sm font-semibold text-white">
                {role === "EMPLOYEE" ? "Employee Portal" : "BESYS Support"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/employee/tickets/new"
                className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold"
                style={{ backgroundColor: TEAL_PRIMARY, color: DARK_GREEN }}
              >
                <Plus className="h-3 w-3" />
                Create
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-md p-2 text-rose-300 hover:text-white"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          <nav className="flex overflow-x-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium"
                  style={{
                    color: isActive ? TEAL_PRIMARY : MUTED_GREY_GREEN,
                    backgroundColor: isActive
                      ? "rgba(47, 217, 196, 0.08)"
                      : "transparent",
                    borderBottom: isActive
                      ? `3px solid ${TEAL_PRIMARY}`
                      : "none",
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="h-24" />
      </div>

      <div className="block md:hidden">
        <div
          className="fixed inset-x-0 top-0 z-40 px-4 py-3"
          style={{
            backgroundColor: DARK_GREEN,
            borderBottom: `1px solid ${BORDER_GREY}`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#2FD9C4]/40 bg-[#0A1C18]">
                <Image
                  src="/besys_logo.webp"
                  alt="Besys Logo"
                  fill
                  className="object-cover rounded-full"
                  priority
                />
              </div>
              <span className="text-sm font-semibold text-white">
                {role === "EMPLOYEE" ? "Employee Portal" : "BESYS"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/employee/tickets/new"
                className="inline-flex items-center justify-center rounded-md p-2"
                style={{ backgroundColor: TEAL_PRIMARY, color: DARK_GREEN }}
              >
                <Plus className="h-4 w-4" />
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-md p-2 text-rose-300"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="h-14" />
      </div>

      <div className="block md:hidden">
        {showMoreMenu && (
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setShowMoreMenu(false)}
          >
            <div
              className="fixed bottom-16 left-0 right-0 px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="overflow-hidden rounded-xl border bg-white"
                style={{ borderColor: BORDER_GREY }}
              >
                {moreItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowMoreMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0"
                      style={{
                        borderColor: BORDER_GREY,
                        color: isActive ? TEAL_PRIMARY : "#334155",
                        backgroundColor: isActive ? LIGHT_TEAL_BG : "#ffffff",
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div
          className="fixed inset-x-0 bottom-0 z-50"
          style={{
            backgroundColor: "rgba(22, 51, 43, 0.96)",
            borderTop: `1px solid ${BORDER_GREY}`,
          }}
        >
          <nav className="flex">
            {mainItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-1 flex-col items-center gap-1 px-1 py-2"
                  style={{ color: isActive ? TEAL_PRIMARY : MUTED_GREY_GREEN }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] truncate">{item.label}</span>
                </Link>
              );
            })}

            <button
              className="flex flex-1 flex-col items-center gap-1 px-1 py-2"
              style={{ color: MUTED_GREY_GREEN }}
              onClick={() => setShowMoreMenu(!showMoreMenu)}
            >
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-[10px]">More</span>
            </button>
          </nav>
        </div>
        <div className="h-16" />
      </div>
    </>
  );
}
