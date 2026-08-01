'use client';

import React, { createContext, useContext } from 'react';
import { colors } from '@/lib/colors';

interface ThemeColors {
    background: string;
    backgroundSecondary: string;
    backgroundTertiary: string;
    foreground: string;
    foregroundMuted: string;
    foregroundSecondary: string;
    foregroundSubtle: string;
    card: string;
    cardForeground: string;
    cardBorder: string;
    accent: string;
    accentForeground: string;
    primary: string;
    primaryForeground: string;
    border: string;
    error: string;
    success: string;
    warning: string;
}

interface ThemeContextType {
    colors: ThemeColors;
}

// Light theme colors only
const themeColors: ThemeColors = {
    background: colors.pageBackground,
    backgroundSecondary: '#FFFFFF',
    backgroundTertiary: colors.lightTealBgAlt,
    foreground: colors.primaryText,
    foregroundMuted: colors.bodyTextGrey,
    foregroundSecondary: colors.bodyTextGrey,
    foregroundSubtle: colors.mutedGreyGreen,
    card: '#FFFFFF',
    cardForeground: colors.primaryText,
    cardBorder: colors.borderGrey,
    accent: colors.lightTealBg,
    accentForeground: colors.darkGreen,
    primary: colors.tealPrimary,
    primaryForeground: colors.darkGreen,
    border: colors.borderGrey,
    error: '#DC2626',
    success: '#10B981',
    warning: '#F59E0B',
};

const defaultThemeContext: ThemeContextType = {
    colors: themeColors,
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

export function useTheme() {
    return useContext(ThemeContext);
}

interface ThemeProviderProps {
    children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    return (
        <ThemeContext.Provider value={{ colors: themeColors }}>
            {children}
        </ThemeContext.Provider>
    );
}
