'use client';

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { useTheme } from '../providers/ThemeProvider';
import { fonts } from '@/lib/fonts';
import { spacing } from '@/lib/spacing';
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
        <Card className="shadow-sm transition-colors" style={{ marginBottom: spacing.page.gap }}>
            <CardContent style={{ padding: spacing.searchBar.padding }}>
                <div className="flex flex-wrap items-center" style={{ gap: spacing.searchBar.gap }}>
                    <div className="relative flex-1" style={{ minWidth: '256px' }}>
                        <Search
                            className="absolute h-5 w-5 pointer-events-none"
                            style={{
                                color: theme.foregroundMuted,
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)'
                            }}
                        />
                        <Input
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="transition-colors"
                            style={{
                                fontSize: fonts.input.regular.size,
                                paddingLeft: '44px',
                                paddingRight: spacing.base,
                                paddingTop: '10px',
                                paddingBottom: '10px',
                                fontFamily: fonts.fontFamily.primary,
                                height: '40px'
                            }}
                        />
                    </div>

                    {filters.map((filter) => (
                        <select
                            key={filter.label}
                            value={filter.value}
                            onChange={(e) => filter.onChange(e.target.value)}
                            className="rounded-md border transition-colors"
                            style={{
                                fontSize: fonts.input.regular.size,
                                backgroundColor: theme.card,
                                borderColor: theme.border,
                                color: theme.foreground,
                                fontFamily: fonts.fontFamily.primary,
                                padding: spacing.searchBar.padding
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