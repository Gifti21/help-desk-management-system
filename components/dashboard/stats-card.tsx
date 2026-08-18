import React from 'react';
import { Card, CardContent } from '../ui/card';

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    change?: string;
    changeType?: 'increase' | 'decrease' | 'neutral';
    icon?: React.ReactNode;
    color?: 'blue' | 'orange' | 'green' | 'red';
}

export function StatsCard({
    title,
    value,
    subtitle,
    change,
    changeType = 'neutral',
    icon,
    color = 'blue'
}: StatsCardProps) {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50',
        orange: 'text-orange-600 bg-orange-50',
        green: 'text-green-600 bg-green-50',
        red: 'text-red-600 bg-red-50'
    };

    const changeColorClasses = {
        increase: 'text-green-600',
        decrease: 'text-red-600',
        neutral: 'text-gray-600'
    };

    return (
        <Card className="relative">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        {icon && (
                            <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-4`}>
                                {icon}
                            </div>
                        )}
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            {title}
                        </h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {value}
                        </p>
                        {subtitle && (
                            <p className="text-sm text-gray-600 mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {change && (
                        <div className={`text-right ${changeColorClasses[changeType]}`}>
                            <div className="text-sm font-medium">
                                {changeType === 'increase' && '+'}
                                {change}
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}