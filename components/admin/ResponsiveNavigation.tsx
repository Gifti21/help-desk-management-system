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
  UserCircle,
  Plus,
  LogOut,
  MoreHorizontal,
} from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  current?: boolean;
}

interface ResponsiveNavigationProps {
  userRole?: string;
  userName?: string;
}

export function ResponsiveNavigation({
  userRole = "ADMIN",
  userName = "Admin User",
}: ResponsiveNavigationProps) {
  const pathname = usePathname();

  const navigationItems: NavigationItem[] = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      current: pathname === "/admin",
    },
    // Employees get "My Tickets"
    ...(userRole === "EMPLOYEE"
      ? [
        {
          name: "My Tickets",
          href: "/admin/my-tickets",
          icon: Ticket,
          current: pathname === "/admin/my-tickets",
        },
      ]
      : []),
    {
      name: "Tickets",
      href: "/admin/tickets",
      icon: FolderOpen,
      current: pathname === "/admin/tickets",
    },
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
    {
      name: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
      current: pathname === "/admin/reports",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      current: pathname === "/admin/settings",
    },
  ];

  const getLinkStyles = (
    isActive: boolean,
    variant: "desktop" | "tablet" | "mobile",
  ) => {
    const baseStyle = {
      transition: "all 0.2s ease-in-out",
      fontFamily: fonts.fontFamily.primary,
    };

    if (variant === "desktop") {
      return {
        ...baseStyle,
        fontSize: fonts.body.regular.size,
        fontWeight: fonts.body.regular.weight,
        lineHeight: fonts.body.regular.lineHeight,
        color: isActive ? colors.tealPrimary : "rgba(255, 255, 255, 0.7)",
        backgroundColor: isActive ? "rgba(47, 217, 196, 0.15)" : "transparent",
        borderLeft: isActive ? `3px solid ${colors.tealPrimary}` : "none",
        padding: isActive ? "8px 12px 8px 9px" : "8px 12px",
        borderRadius: "6px",
      };
    }

    if (variant === "tablet") {
      return {
        ...baseStyle,
        fontSize: fonts.body.sm.size,
        fontWeight: fonts.fontWeight.medium,
        lineHeight: fonts.body.sm.lineHeight,
        color: isActive ? colors.tealPrimary : colors.bodyTextGrey,
        backgroundColor: isActive ? "rgba(255, 255, 255, 0.05)" : "transparent",
        borderBottom: isActive ? `3px solid ${colors.tealPrimary}` : "none",
        padding: isActive ? "12px 16px 9px 16px" : "12px 16px",
        borderRadius: "0",
      };
    }

    // Mobile
    return {
      ...baseStyle,
      fontSize: fonts.caption.regular.size,
      fontWeight: fonts.fontWeight.medium,
      lineHeight: fonts.caption.regular.lineHeight,
      color: isActive ? colors.tealPrimary : colors.bodyTextGrey,
    };
  };

  // Desktop Sidebar (left side)
  const DesktopSidebar = () => (
    <div
      className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:bottom-[52px] lg:top-0 lg:z-50"
      style={{
        backgroundColor: colors.darkGreen,
        borderRight: `1px solid rgba(47, 217, 196, 0.2)`,
        fontFamily: fonts.fontFamily.primary,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center px-6 py-4 flex-shrink-0"
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

      {/* Scrollable Navigation Section */}
      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 py-3 space-y-0.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center rounded-md"
                style={getLinkStyles(item.current || false, "desktop")}
              >
                <Icon className="mr-3 h-5 w-5" style={{
                  color: item.current ? colors.tealPrimary : "rgba(255, 255, 255, 0.7)"
                }} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Create Ticket for Employees */}
        {userRole === "EMPLOYEE" && (
          <div className="px-4 py-3">
            <Link
              href="/tickets/new"
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

      {/* Fixed Bottom - Logout */}
      <div className="flex-shrink-0">
        <div
          className="px-4 py-3"
          style={{ borderTop: `1px solid rgba(47, 217, 196, 0.2)` }}
        >
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="flex items-center w-full px-3 py-2 rounded-md transition-all duration-200 hover:bg-red-600/20"
            style={{
              fontSize: fonts.body.sm.size,
              fontWeight: fonts.body.regular.weight,
              lineHeight: fonts.body.sm.lineHeight,
              color: "rgba(255, 255, 255, 0.7)",
              backgroundColor: "transparent",
            }}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  // Tablet Top Navigation
  const TabletTopNav = () => (
    <div className="hidden md:block lg:hidden">
      <div
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: colors.darkGreen,
          borderBottom: `1px solid rgba(47, 217, 196, 0.2)`,
        }}
      >
        {/* Logo Bar */}
        <div
          className="flex items-center justify-between px-6 py-3"
          style={{ borderBottom: `1px solid rgba(47, 217, 196, 0.2)` }}
        >
          <div className="flex items-center">
            <Image
              src="/besys_logo.webp"
              alt="Company Logo"
              width={28}
              height={28}
              className="rounded mr-3"
            />
            <div
              className="font-semibold"
              style={{
                fontSize: fonts.heading.xs.size,
                fontWeight: fonts.heading.xs.weight,
                color: colors.tealPrimary,
              }}
            >
              BESYS Support
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {userRole === "EMPLOYEE" && (
              <Link
                href="/tickets/new"
                className="flex items-center px-3 py-1 rounded-md transition-all duration-200"
                style={{
                  fontSize: fonts.button.sm.size,
                  fontWeight: fonts.button.sm.weight,
                  color: colors.buttons.primaryText,
                  backgroundColor: colors.buttons.primary,
                }}
              >
                <Plus className="mr-1 h-3 w-3" />
                Create
              </Link>
            )}
            <button
              onClick={() => {
                // Add logout logic here
                window.location.href = '/';
              }}
              className="flex items-center px-3 py-1 rounded-md transition-all duration-200 hover:bg-red-600/20"
              style={{
                fontSize: fonts.button.sm.size,
                fontWeight: fonts.button.sm.weight,
                color: "rgba(255, 255, 255, 0.7)",
                backgroundColor: "transparent",
              }}
            >
              <LogOut className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex overflow-x-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center whitespace-nowrap"
                style={getLinkStyles(item.current || false, "tablet")}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      {/* Spacer for fixed navigation */}
      <div className="h-24" />
    </div>
  );

  // Mobile Bottom Navigation
  const MobileBottomNav = () => {
    const [showMoreMenu, setShowMoreMenu] = React.useState(false);
    const mainItems = navigationItems.slice(0, 4); // First 4 items
    const moreItems = navigationItems.slice(4); // Remaining items

    return (
      <div className="block md:hidden">
        {/* More Menu Overlay */}
        {showMoreMenu && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowMoreMenu(false)}
          >
            <div
              className="fixed bottom-16 left-0 right-0 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="rounded-lg shadow-lg overflow-hidden"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: colors.borderGrey,
                  border: '1px solid',
                }}
              >
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setShowMoreMenu(false)}
                      className="flex items-center px-4 py-3 transition-colors"
                      style={{
                        borderBottom: `1px solid ${colors.borderGrey}`,
                        color: item.current ? colors.tealPrimary : colors.primaryText,
                      }}
                    >
                      <Icon
                        className="h-5 w-5 mr-3"
                        style={{
                          color: item.current ? colors.tealPrimary : colors.bodyTextGrey,
                        }}
                      />
                      <span style={{ fontSize: fonts.body.regular.size }}>
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div
          className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm"
          style={{
            backgroundColor: "rgba(22, 51, 43, 0.95)",
            borderTop: `1px solid rgba(47, 217, 196, 0.2)`,
          }}
        >
          <nav className="flex">
            {mainItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex-1 flex flex-col items-center py-2 px-1 transition-all duration-200"
                  style={getLinkStyles(item.current || false, "mobile")}
                >
                  <Icon
                    className="h-5 w-5 mb-1"
                    style={{
                      color: item.current ? colors.tealPrimary : "rgba(255, 255, 255, 0.7)",
                    }}
                  />
                  <span className="text-xs truncate">{item.name}</span>
                </Link>
              );
            })}
            {/* More Button */}
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="flex-1 flex flex-col items-center py-2 px-1 transition-all duration-200"
              style={{
                fontSize: fonts.caption.regular.size,
                fontWeight: fonts.fontWeight.medium,
                lineHeight: fonts.caption.regular.lineHeight,
                color: colors.bodyTextGrey,
              }}
            >
              <MoreHorizontal
                className="h-5 w-5 mb-1"
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              />
              <span className="text-xs">More</span>
            </button>
          </nav>
        </div>
        {/* Spacer for fixed navigation */}
        <div className="h-16" />
      </div>
    );
  };

  // Mobile Top Header
  const MobileHeader = () => (
    <div className="block md:hidden">
      <div
        className="fixed top-0 left-0 right-0 z-40 px-4 py-3 backdrop-blur-sm"
        style={{
          backgroundColor: "rgba(22, 51, 43, 0.95)",
          borderBottom: `1px solid rgba(47, 217, 196, 0.2)`,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/besys_logo.webp"
              alt="Company Logo"
              width={24}
              height={24}
              className="rounded mr-2"
            />
            <div
              className="font-semibold"
              style={{
                fontSize: fonts.body.lg.size,
                fontWeight: fonts.fontWeight.semibold,
                color: colors.tealPrimary,
              }}
            >
              BESYS Support
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {userRole === "EMPLOYEE" && (
              <Link
                href="/tickets/new"
                className="flex items-center px-2 py-1 rounded-md transition-all duration-200"
                style={{
                  fontSize: fonts.button.sm.size,
                  fontWeight: fonts.button.sm.weight,
                  color: colors.buttons.primaryText,
                  backgroundColor: colors.buttons.primary,
                }}
              >
                <Plus className="h-4 w-4" />
              </Link>
            )}
            <button
              onClick={() => {
                // Add logout logic here
                window.location.href = '/';
              }}
              className="flex items-center px-2 py-1 rounded-md transition-all duration-200 hover:bg-red-600/20"
              style={{
                fontSize: fonts.button.sm.size,
                fontWeight: fonts.button.sm.weight,
                color: "rgba(255, 255, 255, 0.7)",
                backgroundColor: "transparent",
              }}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      {/* Spacer for fixed header */}
      <div className="h-14" />
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <TabletTopNav />
      <MobileHeader />
      <MobileBottomNav />
    </>
  );
}
