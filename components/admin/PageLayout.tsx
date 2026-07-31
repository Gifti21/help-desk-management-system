'use client';

import React from 'react';
import { colors } from '@/lib/colors';
import { fonts } from '@/lib/fonts';
import { spacing } from '@/lib/spacing';
import { darkModeColors } from '@/lib/dark-mode-color';
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
                backgroundColor: isDark ? darkModeColors.background.primary : colors.pageBackground,
                fontFamily: fonts.fontFamily.primary,
                minHeight: '100%',
                padding: spacing.page.padding
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.page.gap }}>
                {children}
            </div>
        </div>
    );
}