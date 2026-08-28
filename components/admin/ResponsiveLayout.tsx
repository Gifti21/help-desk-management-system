"use client";

import React from "react";
import { ResponsiveNavigation } from "./ResponsiveNavigation";
import { useTheme } from "../providers/ThemeProvider";
import { fonts } from "@/lib/fonts";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  userRole?: string;
  userName?: string;
}

export function ResponsiveLayout({
  children,
  userRole = "ADMIN",
  userName = "Admin User",
}: ResponsiveLayoutProps) {
  const { colors } = useTheme();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: colors.background,
        color: colors.foreground,
        fontFamily: fonts.fontFamily.primary,
      }}
    >
      {/* Responsive Navigation */}
      <ResponsiveNavigation userRole={userRole} userName={userName} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
