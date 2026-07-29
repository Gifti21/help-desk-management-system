'use client';

import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { fonts } from '@/lib/fonts';

interface PieChartProps {
    data: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    showLegend?: boolean;
    className?: string;
}

export function PieChart({ data, showLegend = true, className = '' }: PieChartProps) {
    const { colors: theme } = useTheme();
    const total = data.reduce((sum, item) => sum + item.value, 0);

    if (total === 0 || data.length === 0) {
        return (
            <div className={`flex items-center justify-center ${className}`} style={{ minHeight: '200px' }}>
                <p style={{ color: theme.foregroundMuted, fontSize: fonts.body.sm.size }}>
                    No data available
                </p>
            </div>
        );
    }

    let cumulativePercentage = 0;

    const createPath = (percentage: number, startAngle: number) => {
        const endAngle = startAngle + (percentage / 100) * 360;
        const start = polarToCartesian(50, 50, 40, endAngle);
        const end = polarToCartesian(50, 50, 40, startAngle);
        const largeArcFlag = percentage > 50 ? 1 : 0;

        return [
            "M", 50, 50,
            "L", start.x, start.y,
            "A", 40, 40, 0, largeArcFlag, 0, end.x, end.y,
            "Z"
        ].join(" ");
    };

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    };

    return (
        <div className={`flex flex-col lg:flex-row items-center justify-center gap-6 ${className}`}>
            <div className="relative">
                <svg width="200" height="200" viewBox="0 0 100 100" className="transform -rotate-90">
                    {data.map((item, index) => {
                        const percentage = (item.value / total) * 100;
                        const startAngle = cumulativePercentage * 3.6;
                        cumulativePercentage += percentage;

                        if (percentage === 0) return null;

                        return (
                            <path
                                key={index}
                                d={createPath(percentage, startAngle)}
                                fill={item.color}
                                className="transition-all duration-300 hover:opacity-80"
                            />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div
                            style={{
                                fontSize: fonts.heading.lg.size,
                                fontWeight: fonts.heading.lg.weight,
                                color: theme.foreground
                            }}
                        >
                            {total}
                        </div>
                        <div style={{ fontSize: fonts.caption.regular.size, color: theme.foregroundMuted }}>
                            Total
                        </div>
                    </div>
                </div>
            </div>

            {showLegend && (
                <div className="space-y-2">
                    {data.map((item, index) => {
                        const percentage = ((item.value / total) * 100).toFixed(1);
                        return (
                            <div key={index} className="flex items-center space-x-3">
                                <div
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: item.color }}
                                />
                                <div>
                                    <p
                                        style={{
                                            fontSize: fonts.body.sm.size,
                                            color: theme.foreground
                                        }}
                                    >
                                        {item.name}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: fonts.caption.regular.size,
                                            color: theme.foregroundMuted
                                        }}
                                    >
                                        {item.value} ({percentage}%)
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}