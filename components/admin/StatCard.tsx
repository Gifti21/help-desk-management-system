'use client';

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { colors } from '@/lib/colors';
import { fonts } from '@/lib/fonts';
import { darkModeColors } from '@/lib/dark-mode-color';
import { useTheme } from '../providers/ThemeProvider';
import { LucideIcon } from 'lucide-react';

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
    trendColor = colors.tealPrimary
}: StatCardProps) {
    const { isDark } = useTheme();

    return (
        <Card
            className="shadow-sm transition-colors"
            style={{
                backgroundColor: isDark ? darkModeColors.card.background : 'white',
                borderColor: isDark ? darkModeColors.border.primary : colors.borderGrey
            }}
        >
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <h3
                            className="uppercase tracking-wide mb-1"
                            style={{
                                fontSize: fonts.caption.regular.size,
                                fontWeight: fonts.caption.regular.weight,
                                color: isDark ? darkModeColors.text.secondary : colors.bodyTextGrey,
                                letterSpacing: fonts.caption.regular.letterSpacing
                            }}
                        >
                            {title}
                        </h3>
                        <p
                            className="font-bold mb-1"
                            style={{
                                fontSize: fonts.heading.md.size,
                                fontWeight: fonts.heading.md.weight,
                                color: isDark ? darkModeColors.text.primary : colors.primaryText,
                                lineHeight: fonts.heading.md.lineHeight
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
                                    fontWeight: trend ? fonts.fontWeight.medium : fonts.fontWeight.regular
                                }}
                            >
                                {trend || subtitle}
                            </p>
                        )}
                    </div>
                    <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: isDark ? darkModeColors.background.tertiary : colors.lightTealBg }}
                    >
                        <Icon className="h-6 w-6" style={{ color: iconColor }} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}