'use client';

import React from 'react';
import { colors } from '@/lib/colors';
import { fonts } from '@/lib/fonts';
import { useTheme } from '../providers/ThemeProvider';

interface PageLayoutProps {
    children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
    const { isDark } = useTheme();

    return (
        <div
            className="transition-colors"
            style={{
                backgroundColor: isDark ? '#0A0E27' : colors.pageBackground,
                fontFamily: fonts.fontFamily.primary,
                minHeight: '100%'
            }}
        >
            {children}
        </div>
    );
}