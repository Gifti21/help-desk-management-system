'use client';

import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { fonts } from '@/lib/fonts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LucideIcon } from 'lucide-react';

interface ReportCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    trend?: string;
    trendColor?: string;
    className?: string;
    children?: React.ReactNode;
}

export function ReportCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendColor,
    className = '',
    children
}: ReportCardProps) {
    const { colors: theme } = useTheme();

    return (
        <Card
            className={`shadow-sm transition-colors ${className}`}
            style={{
                backgroundColor: 'var(--card)',
                borderColor: 'var(--card-border)'
            }}
        >
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle
                        style={{
                            fontSize: fonts.body.sm.size,
                            fontWeight: fonts.fontWeight.medium,
                            color: theme.foregroundMuted
                        }}
                    >
                        {title}
                    </CardTitle>
                    {Icon && (
                        <Icon className="h-4 w-4" style={{ color: theme.primary }} />
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-2">
                    <div
                        style={{
                            fontSize: fonts.heading.xl.size,
                            fontWeight: fonts.heading.xl.weight,
                            color: theme.foreground
                        }}
                    >
                        {value}
                    </div>

                    {subtitle && (
                        <p
                            style={{
                                fontSize: fonts.caption.regular.size,
                                color: theme.foregroundMuted
                            }}
                        >
                            {subtitle}
                        </p>
                    )}

                    {trend && (
                        <p
                            style={{
                                fontSize: fonts.caption.regular.size,
                                color: trendColor || theme.foregroundMuted
                            }}
                        >
                            {trend}
                        </p>
                    )}

                    {children}
                </div>
            </CardContent>
        </Card>
    );
}