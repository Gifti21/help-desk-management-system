'use client';

import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { fonts } from '@/lib/fonts';

interface LineChartProps {
    data: Array<{
        label: string;
        value: number;
    }>;
    height?: number;
    color?: string;
    className?: string;
}

export function LineChart({ data, height = 200, color, className = '' }: LineChartProps) {
    const { colors: theme } = useTheme();
    const lineColor = color || theme.primary;

    if (data.length === 0) {
        return (
            <div className={`flex items-center justify-center ${className}`} style={{ height: `${height}px` }}>
                <p style={{ color: theme.foregroundMuted, fontSize: fonts.body.sm.size }}>
                    No data available
                </p>
            </div>
        );
    }

    const maxValue = Math.max(...data.map(item => item.value));
    const minValue = Math.min(...data.map(item => item.value));
    const range = maxValue - minValue || 1;

    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = 600;
    const chartHeight = height;
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;

    const points = data.map((item, index) => {
        const x = padding.left + (index / (data.length - 1 || 1)) * plotWidth;
        const y = padding.top + plotHeight - ((item.value - minValue) / range) * plotHeight;
        return { x, y, ...item };
    });

    const pathD = points.map((point, index) =>
        `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
        <div className={className}>
            <svg
                width="100%"
                height={height}
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="none"
            >
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                    const y = padding.top + plotHeight * (1 - ratio);
                    return (
                        <line
                            key={i}
                            x1={padding.left}
                            y1={y}
                            x2={chartWidth - padding.right}
                            y2={y}
                            stroke={theme.border}
                            strokeWidth="1"
                            strokeDasharray="4"
                        />
                    );
                })}

                {/* Line path */}
                <path
                    d={pathD}
                    fill="none"
                    stroke={lineColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Data points */}
                {points.map((point, index) => (
                    <g key={index}>
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r="4"
                            fill={lineColor}
                            stroke={theme.card}
                            strokeWidth="2"
                        />
                    </g>
                ))}

                {/* X-axis labels */}
                {points.map((point, index) => (
                    <text
                        key={index}
                        x={point.x}
                        y={chartHeight - padding.bottom + 20}
                        textAnchor="middle"
                        fill={theme.foregroundMuted}
                        fontSize={fonts.caption.regular.size}
                    >
                        {point.label}
                    </text>
                ))}

                {/* Y-axis labels */}
                {[0, 0.5, 1].map((ratio, i) => {
                    const y = padding.top + plotHeight * (1 - ratio);
                    const value = minValue + range * ratio;
                    return (
                        <text
                            key={i}
                            x={padding.left - 10}
                            y={y + 4}
                            textAnchor="end"
                            fill={theme.foregroundMuted}
                            fontSize={fonts.caption.regular.size}
                        >
                            {Math.round(value)}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}
