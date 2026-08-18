'use client';

import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { fonts } from '@/lib/fonts';
import { Calendar, Filter } from 'lucide-react';

export interface FilterOption {
    label: string;
    value: string;
}

export interface ReportFilter {
    id: string;
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
}

interface ReportFiltersProps {
    dateRange: string;
    onDateRangeChange: (value: string) => void;
    filters: ReportFilter[];
}

export function ReportFilters({ dateRange, onDateRangeChange, filters }: ReportFiltersProps) {
    const { colors: theme } = useTheme();

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-3">
                <Filter className="h-5 w-5" style={{ color: theme.primary }} />
                <h3
                    style={{
                        fontSize: fonts.heading.sm.size,
                        fontWeight: fonts.heading.sm.weight,
                        color: theme.foreground
                    }}
                >
                    Filters
                </h3>
            </div>

            {/* Date Range Filter */}
            <div>
                <label
                    className="block mb-2"
                    style={{
                        fontSize: fonts.body.sm.size,
                        fontWeight: fonts.fontWeight.medium,
                        color: theme.foreground
                    }}
                >
                    Date Range
                </label>
                <div className="relative">
                    <Calendar
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                        style={{ color: theme.foregroundMuted }}
                    />
                    <input
                        type="text"
                        value={dateRange}
                        onChange={(e) => onDateRangeChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-md transition-colors"
                        style={{
                            fontSize: fonts.body.regular.size,
                            backgroundColor: 'var(--background)',
                            color: 'var(--foreground)',
                            borderColor: 'var(--border)'
                        }}
                        placeholder="Select date range"
                    />
                </div>
            </div>

            {/* Dynamic Filters */}
            {filters.map((filter) => (
                <div key={filter.id}>
                    <label
                        className="block mb-2"
                        style={{
                            fontSize: fonts.body.sm.size,
                            fontWeight: fonts.fontWeight.medium,
                            color: theme.foreground
                        }}
                    >
                        {filter.label}
                    </label>
                    <select
                        value={filter.value}
                        onChange={(e) => filter.onChange(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md transition-colors"
                        style={{
                            fontSize: fonts.body.regular.size,
                            backgroundColor: 'var(--background)',
                            color: 'var(--foreground)',
                            borderColor: 'var(--border)'
                        }}
                    >
                        {filter.options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
}
