/*
THEME SYSTEM FOR HDMS ADMIN INTERFACE
Provides light and dark mode support with consistent design tokens
*/

export const lightTheme = {
    // Background colors
    background: {
        primary: '#F7F9F8',      // Page background
        secondary: '#FFFFFF',     // Card/component background
        tertiary: '#E5F9F6',     // Light teal background
        quaternary: '#E6F8F5',   // Alternative light background
    },

    // Text colors
    text: {
        primary: '#1A1D1C',      // Primary text
        secondary: '#6B6E6C',    // Body text grey
        muted: '#9BB0AB',        // Muted grey green
        inverse: '#FFFFFF',      // White text for dark backgrounds
    },

    // Border and surface colors
    border: {
        primary: '#E3ECE8',      // Border grey
        secondary: '#D1D5DB',    // Lighter border
        focus: '#2FD9C4',        // Focus border (teal)
    },

    // Brand colors (consistent across themes)
    brand: {
        primary: '#2FD9C4',      // Teal primary
        primaryHover: '#24C3B0', // Teal hover
        dark: '#16332B',         // Dark green
    },

    // Status colors
    status: {
        success: '#15803d',
        warning: '#f59e0b',
        error: '#dc2626',
        info: '#3b82f6',
    }
};

export const darkTheme = {
    // Background colors
    background: {
        primary: '#0F172A',      // Dark slate background
        secondary: '#1E293B',    // Card/component background
        tertiary: '#334155',     // Elevated background
        quaternary: '#475569',   // Alternative background
    },

    // Text colors
    text: {
        primary: '#F8FAFC',      // Primary text (light)
        secondary: '#CBD5E1',    // Secondary text
        muted: '#94A3B8',        // Muted text
        inverse: '#1A1D1C',      // Dark text for light backgrounds
    },

    // Border and surface colors
    border: {
        primary: '#374151',      // Border
        secondary: '#4B5563',    // Lighter border
        focus: '#2FD9C4',        // Focus border (teal)
    },

    // Brand colors (consistent across themes)
    brand: {
        primary: '#2FD9C4',      // Teal primary
        primaryHover: '#24C3B0', // Teal hover
        dark: '#16332B',         // Dark green
    },

    // Status colors
    status: {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
    }
};

export type Theme = typeof lightTheme;

export const getThemeColors = (isDark: boolean): Theme => {
    return isDark ? darkTheme : lightTheme;
};