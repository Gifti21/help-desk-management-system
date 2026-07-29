'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { colors } from '@/lib/colors';
import { darkModeColors } from '@/lib/dark-mode-color';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    cardBorder: string;
    foregroundMuted: string;
    accent: string;
    accentForeground: string;
    primary: string;
}

interface ThemeContextType {
    mode: ThemeMode;
    isDark: boolean;
    colors: ThemeColors;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
}

// Light theme colors mapping
const lightColors: ThemeColors = {
    background: colors.pageBackground,
    foreground: colors.primaryText,
    card: '#FFFFFF',
    cardForeground: colors.primaryText,
    cardBorder: colors.borderGrey,
    foregroundMuted: colors.bodyTextGrey,
    accent: colors.lightTealBg,
    accentForeground: colors.darkGreen,
    primary: colors.tealPrimary,
};

// Dark theme colors mapping
const darkColors: ThemeColors = {
    background: darkModeColors.background.primary,
    foreground: darkModeColors.text.primary,
    card: darkModeColors.card.background,
    cardForeground: darkModeColors.text.primary,
    cardBorder: darkModeColors.border.primary,
    foregroundMuted: darkModeColors.text.secondary,
    accent: darkModeColors.background.tertiary,
    accentForeground: darkModeColors.accent.primary,
    primary: darkModeColors.accent.primary,
};

const defaultThemeContext: ThemeContextType = {
    mode: 'system',
    isDark: false,
    colors: lightColors,
    toggleTheme: () => { },
    setTheme: () => { }
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

export function useTheme() {
    return useContext(ThemeContext);
}

interface ThemeProviderProps {
    children: React.ReactNode;
    defaultMode?: ThemeMode;
}

export function ThemeProvider({ children, defaultMode = 'system' }: ThemeProviderProps) {
    const [mode, setMode] = useState<ThemeMode>(defaultMode);
    const [isDark, setIsDark] = useState(false);

    // Determine if dark mode should be active
    const calculateIsDark = (themeMode: ThemeMode): boolean => {
        if (themeMode === 'dark') return true;
        if (themeMode === 'light') return false;
        // System preference
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    };

    // Load theme preference from localStorage on mount
    useEffect(() => {
        const savedMode = localStorage.getItem('hdms-theme') as ThemeMode;
        const validModes: ThemeMode[] = ['light', 'dark', 'system'];

        if (savedMode && validModes.includes(savedMode)) {
            setMode(savedMode);
            setIsDark(calculateIsDark(savedMode));
        } else {
            // Use system preference as default
            const systemDark = calculateIsDark('system');
            setMode('system');
            setIsDark(systemDark);
        }
    }, []);

    // Listen to system theme changes when in system mode
    useEffect(() => {
        if (mode !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDark(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [mode]);

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;

        // Apply dark class for Tailwind
        root.classList.toggle('dark', isDark);

        // Update body styles for smooth transition
        document.body.style.backgroundColor = isDark ? darkModeColors.background.primary : colors.pageBackground;
        document.body.style.color = isDark ? darkModeColors.text.primary : colors.primaryText;
        document.body.style.transition = 'background-color 0.2s ease, color 0.2s ease';

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', isDark ? darkModeColors.sidebar.background : colors.darkGreen);
        }
    }, [isDark]);

    const setTheme = (newMode: ThemeMode) => {
        setMode(newMode);
        setIsDark(calculateIsDark(newMode));
        localStorage.setItem('hdms-theme', newMode);
    };

    const toggleTheme = () => {
        const newMode = isDark ? 'light' : 'dark';
        setTheme(newMode);
    };

    const themeColors = isDark ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{
            mode,
            isDark,
            colors: themeColors,
            toggleTheme,
            setTheme
        }}>
            {children}
        </ThemeContext.Provider>
    );
}
