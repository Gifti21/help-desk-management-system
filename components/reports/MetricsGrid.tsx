'use client';

import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { fonts } from '@/lib/fonts';
import { ReportCard } from './ReportCard';
import {
    Ticket,
    Clock,
    Shield,
    Star,
    Users,
    TrendingUp,
    Target,
    Activity
} from 'lucide-react';

interface MetricData {
    id: string;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: string;
    trendColor?: string;
    icon?: string;
}

interface MetricsGridProps {
    metrics: MetricData[];
    className?: string;
}

const iconMap = {
    ticket: Ticket,
    clock: Clock,
    shield: Shield,
    star: Star,
    users: Users,
    trending: TrendingUp,
    target: Target,
    activity: Activity
};

export function MetricsGrid({ metrics, className = '' }: MetricsGridProps) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
            {metrics.map((metric) => {
                const IconComponent = metric.icon ? iconMap[metric.icon as keyof typeof iconMap] : undefined;

                return (
                    <ReportCard
                        key={metric.id}
                        title={metric.title}
                        value={metric.value}
                        subtitle={metric.subtitle}
                        trend={metric.trend}
                        trendColor={metric.trendColor}
                        icon={IconComponent}
                    />
                );
            })}
        </div>
    );
}