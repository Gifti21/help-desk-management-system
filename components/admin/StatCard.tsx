"use client";

import React from "react";
import { Card, CardContent } from "../ui/card";
import { colors } from "@/lib/colors";
import { fonts } from "@/lib/fonts";
import { spacing } from "@/lib/spacing";
import { useTheme } from "../providers/ThemeProvider";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: string;
  trendColor?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = colors.tealPrimary,
  trend,
  trendColor = colors.tealPrimary,
}: StatCardProps) {
  return (
    <Card
      className="shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer rounded-2xl border-2"
      style={{
        backgroundColor: "white",
        borderColor: colors.borderGrey,
        borderRadius: "16px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        transition: "all 0.3s ease-in-out",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.tealPrimary;
        e.currentTarget.style.boxShadow = `0 10px 25px -5px rgba(20, 184, 166, 0.3), 0 0 20px rgba(20, 184, 166, 0.2)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.borderGrey;
        e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
      }}
    >
      <CardContent style={{ padding: spacing.card.padding }}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3
              className="uppercase tracking-wide"
              style={{
                fontSize: fonts.caption.regular.size,
                fontWeight: fonts.caption.regular.weight,
                color: colors.bodyTextGrey,
                letterSpacing: fonts.caption.regular.letterSpacing,
                marginBottom: spacing.xs,
              }}
            >
              {title}
            </h3>
            <p
              className="font-bold"
              style={{
                fontSize: fonts.heading.md.size,
                fontWeight: fonts.heading.md.weight,
                color: colors.primaryText,
                lineHeight: fonts.heading.md.lineHeight,
                marginBottom: spacing.xs,
              }}
            >
              {value}
            </p>
            {(subtitle || trend) && (
              <p
                style={{
                  fontSize: fonts.body.xs.size,
                  color: trendColor,
                  lineHeight: fonts.body.xs.lineHeight,
                  fontWeight: trend
                    ? fonts.fontWeight.medium
                    : fonts.fontWeight.regular,
                }}
              >
                {trend || subtitle}
              </p>
            )}
          </div>
          <div
            className="rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-6"
            style={{
              backgroundColor: colors.lightTealBg,
              width: "48px",
              height: "48px",
            }}
          >
            <Icon
              className="h-6 w-6 transition-all duration-300"
              style={{ color: iconColor }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
