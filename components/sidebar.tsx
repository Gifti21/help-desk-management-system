"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { colors } from "@/lib/colors";
import { fonts } from "@/lib/fonts";
import {
  LayoutDashboard,
  Ticket,
  Users,
  Building2,
  FolderOpen,
  BarChart3,
  Settings,
  Plus,
  UserCircle,
} from "lucide-react";

interface SidebarProps {
  userRole?: string;
  userName?: string;
}

export function Sidebar({
  userRole = "ADMIN",
  userName = "Admin User",
}: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: userRole === "EMPLOYEE" ? "/employee/dashboard" : "/admin",
      icon: LayoutDashboard,
      current:
        userRole === "EMPLOYEE"
          ? pathname === "/employee/dashboard"
          : pathname === "/admin",
    },
    // Employees get "My Tickets"
    ...(userRole === "EMPLOYEE"
      ? [
          {
            name: "My Tickets",
            href: "/employee/tickets",
            icon: Ticket,
            current:
              pathname === "/employee/tickets" ||
              pathname.startsWith("/employee/tickets/"),
          },
        ]
      : []),
    // Admin gets "All Tickets"
    ...(userRole === "ADMIN" || userRole === "AGENT"
      ? [
          {
            name: "All Tickets",
            href: "/admin/tickets",
            icon: FolderOpen,
            current: pathname === "/admin/tickets",
          },
        ]
      : []),
    ...(userRole === "ADMIN"
      ? [
          {
            name: "Users",
            href: "/admin/users",
            icon: Users,
            current: pathname === "/admin/users",
          },
          {
            name: "Departments",
            href: "/admin/departments",
            icon: Building2,
            current: pathname === "/admin/departments",
          },
          {
            name: "Categories",
            href: "/admin/categories",
            icon: FolderOpen,
            current: pathname === "/admin/categories",
          },
        ]
      : []),
    ...(userRole === "ADMIN" || userRole === "AGENT"
      ? [
          {
            name: "Reports",
            href: "/admin/reports",
            icon: BarChart3,
            current: pathname === "/admin/reports",
          },
        ]
      : []),
    // Profile link for all users
    {
      name: "Profile",
      href:
        userRole === "EMPLOYEE"
          ? "/employee/profile"
          : userRole === "AGENT"
            ? "/dashboard/technician/profile"
            : "/admin/profile",
      icon: UserCircle,
      current:
        userRole === "EMPLOYEE"
          ? pathname === "/employee/profile"
          : userRole === "AGENT"
            ? pathname === "/dashboard/technician/profile"
            : pathname === "/admin/profile",
    },
    {
      name: "Settings",
      href:
        userRole === "EMPLOYEE"
          ? "/employee/settings"
          : userRole === "AGENT"
            ? "/dashboard/technician/settings"
            : "/admin/settings",
      icon: Settings,
      current:
        userRole === "EMPLOYEE"
          ? pathname === "/employee/settings"
          : userRole === "AGENT"
            ? pathname === "/dashboard/technician/settings"
            : pathname === "/admin/settings",
    },
  ];

  return (
    <div
      className="flex flex-col w-64 h-screen"
      style={{
        backgroundColor: colors.darkGreen,
        borderRight: `1px solid rgba(47, 217, 196, 0.2)`,
        fontFamily: fonts.fontFamily.primary,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center px-6 py-4"
        style={{ borderBottom: `1px solid rgba(47, 217, 196, 0.2)` }}
      >
        <div className="flex items-center">
          <Image
            src="/besys_logo.webp"
            alt="Company Logo"
            width={32}
            height={32}
            className="rounded"
          />
          <div className="ml-3">
            <div
              className="font-semibold"
              style={{
                fontSize: fonts.heading.sm.size,
                fontWeight: fonts.heading.sm.weight,
                color: colors.tealPrimary,
                lineHeight: fonts.heading.sm.lineHeight,
              }}
            >
              BESYS Support
            </div>
            <div
              style={{
                fontSize: fonts.body.sm.size,
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: fonts.body.sm.lineHeight,
              }}
            >
              Admin Portal
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-3 py-2 rounded-md transition-all duration-200"
              style={{
                fontSize: fonts.body.regular.size,
                fontWeight: fonts.body.regular.weight,
                lineHeight: fonts.body.regular.lineHeight,
                color: item.current
                  ? colors.tealPrimary
                  : "rgba(255, 255, 255, 0.7)",
                backgroundColor: item.current
                  ? "rgba(47, 217, 196, 0.15)"
                  : "transparent",
                borderLeft: item.current
                  ? `3px solid ${colors.tealPrimary}`
                  : "none",
                paddingLeft: item.current ? "12px" : "12px",
              }}
            >
              <Icon
                className="mr-3 h-5 w-5"
                style={{
                  color: item.current
                    ? colors.tealPrimary
                    : "rgba(255, 255, 255, 0.7)",
                }}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Only Employees can create tickets according to SRS */}
      {userRole === "EMPLOYEE" && (
        <div
          className="p-4"
          style={{ borderTop: `1px solid rgba(47, 217, 196, 0.2)` }}
        >
          <Link
            href="/employee/tickets/new"
            className="flex items-center justify-center w-full px-4 py-2 rounded-md transition-all duration-200 hover:shadow-md"
            style={{
              fontSize: fonts.button.regular.size,
              fontWeight: fonts.button.regular.weight,
              lineHeight: fonts.button.regular.lineHeight,
              color: colors.buttons.primaryText,
              backgroundColor: colors.buttons.primary,
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Ticket
          </Link>
        </div>
      )}
    </div>
  );
}
