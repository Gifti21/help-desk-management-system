'use client';

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { colors } from '@/lib/colors';
import { fonts } from '@/lib/fonts';
import { spacing } from '@/lib/spacing';
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
    return (
        <Card
            className="shadow-sm transition-colors"
            style={{
                backgroundColor: 'white',
                borderColor: colors.borderGrey
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
                                marginBottom: spacing.xs
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
                                marginBottom: spacing.xs
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
                        className="rounded-lg flex items-center justify-center"
                        style={{
                            backgroundColor: colors.lightTealBg,
                            width: '48px',
                            height: '48px'
                        }}
                    >
                        <Icon className="h-6 w-6" style={{ color: iconColor }} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}