"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "../providers/ThemeProvider";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { Avatar } from "@/components/ui/Avatar";
import { fonts } from "@/lib/fonts";
import { getProfile, type UserProfile } from "@/lib/api/profile";

interface TopBarProps {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  const { colors } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const userInitials = profile
    ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
    : "AD";
  const userName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : "Admin";

  return (
    <div
      className="px-4 py-4 md:px-6 border-b transition-colors"
      style={{
        backgroundColor: colors.card,
        borderBottomColor: colors.cardBorder,
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1
            className="break-words font-semibold text-lg sm:text-xl"
            style={{
              fontSize: fonts.heading.md.size,
              fontWeight: fonts.heading.md.weight,
              color: colors.cardForeground,
              lineHeight: fonts.heading.md.lineHeight,
            }}
          >
            {title}
          </h1>
          <p
            className="mt-1 hidden sm:block"
            style={{
              fontSize: fonts.body.sm.size,
              color: colors.foregroundMuted,
              lineHeight: fonts.body.sm.lineHeight,
            }}
          >
            {subtitle}
          </p>
        </div>

        <div className="ml-auto flex max-w-full flex-wrap items-center justify-end gap-2 md:gap-3">
          {/* Responsive actions - stack on mobile */}
          <div className="flex max-w-full flex-wrap justify-end gap-2 sm:gap-3">
            {actions}
          </div>

          {/* Notification bell and profile - visible on all screen sizes */}
          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell role="ADMIN" />

            <Link
              href="/admin/profile"
              aria-label="Open profile"
              className="flex items-center gap-2 rounded-lg sm:gap-3 transition hover:opacity-80"
            >
              <Avatar initials={userInitials} size="md" />
              <span
                className="hidden sm:block"
                style={{
                  fontFamily: fonts.fontFamily.primary,
                  fontSize: fonts.body.regular.size,
                  lineHeight: fonts.body.regular.lineHeight,
                  fontWeight: fonts.fontWeight.medium,
                  letterSpacing: fonts.body.regular.letterSpacing,
                  color: colors.cardForeground,
                }}
              >
                {userName}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
