'use client';

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { useTheme } from '../providers/ThemeProvider';
import { fonts } from '@/lib/fonts';
import { Search } from 'lucide-react';

interface FilterOption {
    label: string;
    value: string;
}

interface SearchFilterProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    filters?: Array<{
        label: string;
        value: string;
        options: FilterOption[];
        onChange: (value: string) => void;
    }>;
}

export function SearchFilter({
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search...',
    filters = []
}: SearchFilterProps) {
    const { colors: theme } = useTheme();

    return (
        <Card
            className="shadow-sm mb-6 transition-colors"
            style={{
                backgroundColor: theme.card,
                borderColor: theme.cardBorder
            }}
        >
            <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-64">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                            style={{ color: theme.foregroundMuted }}
                        />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 transition-colors"
                            style={{
                                fontSize: fonts.input.regular.size,
                                backgroundColor: theme.backgroundSecondary,
                                borderColor: theme.border,
                                color: theme.foreground,
                                fontFamily: fonts.fontFamily.primary
                            }}
                        />
                    </div>

                    {filters.map((filter) => (
                        <select
                            key={filter.label}
                            value={filter.value}
                            onChange={(e) => filter.onChange(e.target.value)}
                            className="px-3 py-2 rounded-md border transition-colors"
                            style={{
                                fontSize: fonts.input.regular.size,
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                                color: theme.foreground,
                                fontFamily: fonts.fontFamily.primary
                            }}
                        >
                            {filter.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}