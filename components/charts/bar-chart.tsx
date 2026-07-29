'use client';

import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { fonts } from '@/lib/fonts';

interface BarChartProps {
    data: Array<{
        name: string;
        value: number;
        color?: string;
    }>;
    height?: number;
    horizontal?: boolean;
    className?: string;
}

export function BarChart({ data, height = 300, horizontal = false, className = '' }: BarChartProps) {
    const { colors: theme } = useTheme();
    const maxValue = Math.max(...data.map(item => item.value), 1);

    if (data.length === 0) {
        return (
            <div className={`flex items-center justify-center ${className}`} style={{ height: `${height}px` }}>
                <p style={{ color: theme.foregroundMuted, fontSize: fonts.body.sm.size }}>
                    No data available
                </p>
            </div>
        );
    }

    if (horizontal) {
        return (
            <div className={`space-y-4 ${className}`}>
                {data.map((item, index) => {
                    const width = (item.value / maxValue) * 100;
                    const barColor = item.color || theme.primary;

                    return (
                        <div key={index}>
                            <div className="flex justify-between items-center mb-2">
                                <span
                                    style={{
                                        fontSize: fonts.body.sm.size,
                                        fontWeight: fonts.fontWeight.medium,
                                        color: theme.foreground
                                    }}
                                >
                                    {item.name}
                                </span>
                                <span
                                    style={{
                                        fontSize: fonts.body.sm.size,
                                        fontWeight: fonts.fontWeight.semibold,
                                        color: theme.foreground
                                    }}
                                >
                                    {item.value}
                                </span>
                            </div>
                            <div
                                className="w-full rounded-full h-3"
                                style={{ backgroundColor: theme.backgroundTertiary }}
                            >
                                <div
                                    className="h-3 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${width}%`,
                                        backgroundColor: barColor
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <div className={`w-full ${className}`} style={{ height: `${height}px` }}>
            <div className="flex items-end justify-between h-full space-x-2">
                {data.map((item, index) => {
                    const barHeight = (item.value / maxValue) * 100;
                    const barColor = item.color || theme.primary;

                    return (
                        <div key={index} className="flex flex-col items-center flex-1">
                            <div className="flex items-end w-full" style={{ height: '80%' }}>
                                <div
                                    className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                                    style={{
                                        height: `${barHeight}%`,
                                        backgroundColor: barColor
                                    }}
                                    title={`${item.name}: ${item.value}`}
                                />
                            </div>
                            <div
                                className="text-center mt-2"
                                style={{
                                    fontSize: fonts.caption.regular.size,
                                    color: theme.foregroundMuted
                                }}
                            >
                                {item.name}
                            </div>
                            <div
                                style={{
                                    fontSize: fonts.body.sm.size,
                                    fontWeight: fonts.fontWeight.semibold,
                                    color: theme.foreground
                                }}
                            >
                                {item.value}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}