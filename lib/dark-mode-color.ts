/**
 * Dark Mode Color Palette for BESYS Support System
 * Based on modern dark UI design with teal/cyan accents
 */

export const darkModeColors = {
    // Background colors
    background: {
        primary: '#0A1628',        // Main dark blue background
        secondary: '#152238',      // Card/panel background
        tertiary: '#1A2942',       // Hover states, elevated elements
        sidebar: '#0D1B2A',        // Sidebar background
    },

    // Primary accent colors (Teal/Cyan)
    accent: {
        primary: '#2DD4BF',        // Main teal accent
        secondary: '#14B8A6',      // Darker teal
        tertiary: '#5EEAD4',       // Lighter teal/cyan
        glow: 'rgba(45, 212, 191, 0.2)', // Glow effect
    },

    // Text colors
    text: {
        primary: '#F8FAFC',        // Primary white text
        secondary: '#94A3B8',      // Muted gray text
        tertiary: '#64748B',       // Even more muted
        disabled: '#475569',       // Disabled state
        accent: '#2DD4BF',         // Teal text
    },

    // Status colors
    status: {
        critical: {
            base: '#EF4444',         // Red
            bg: 'rgba(239, 68, 68, 0.1)',
            text: '#FCA5A5',
        },
        high: {
            base: '#F97316',         // Orange
            bg: 'rgba(249, 115, 22, 0.1)',
            text: '#FDBA74',
        },
        medium: {
            base: '#8B5CF6',         // Purple
            bg: 'rgba(139, 92, 246, 0.1)',
            text: '#C4B5FD',
        },
        low: {
            base: '#3B82F6',         // Blue
            bg: 'rgba(59, 130, 246, 0.1)',
            text: '#93C5FD',
        },
        open: {
            base: '#EF4444',         // Red
            bg: 'rgba(239, 68, 68, 0.1)',
            text: '#FCA5A5',
        },
        inProgress: {
            base: '#2DD4BF',         // Teal
            bg: 'rgba(45, 212, 191, 0.1)',
            text: '#5EEAD4',
        },
        pending: {
            base: '#8B5CF6',         // Purple
            bg: 'rgba(139, 92, 246, 0.1)',
            text: '#C4B5FD',
        },
        resolved: {
            base: '#10B981',         // Green
            bg: 'rgba(16, 185, 129, 0.1)',
            text: '#6EE7B7',
        },
        closed: {
            base: '#64748B',         // Gray
            bg: 'rgba(100, 116, 139, 0.1)',
            text: '#94A3B8',
        },
    },

    // Chart colors (for data visualization)
    chart: {
        primary: '#2DD4BF',        // Teal
        secondary: '#F472B6',      // Pink
        tertiary: '#FBBF24',       // Amber
        quaternary: '#8B5CF6',     // Purple
        gradient1: 'rgba(45, 212, 191, 0.8)',
        gradient2: 'rgba(244, 114, 182, 0.8)',
    },

    // Border colors
    border: {
        primary: 'rgba(45, 212, 191, 0.2)',   // Teal border
        secondary: 'rgba(148, 163, 184, 0.1)', // Muted border
        focus: '#2DD4BF',                      // Focus state
    },

    // Button colors
    button: {
        primary: {
            bg: '#2DD4BF',
            hover: '#14B8A6',
            active: '#0D9488',
            text: '#0A1628',
        },
        secondary: {
            bg: 'rgba(45, 212, 191, 0.1)',
            hover: 'rgba(45, 212, 191, 0.2)',
            active: 'rgba(45, 212, 191, 0.3)',
            text: '#2DD4BF',
        },
        danger: {
            bg: '#EF4444',
            hover: '#DC2626',
            active: '#B91C1C',
            text: '#FFFFFF',
        },
    },

    // Sidebar specific colors
    sidebar: {
        background: '#0D1B2A',
        itemActive: 'rgba(45, 212, 191, 0.15)',
        itemHover: 'rgba(45, 212, 191, 0.08)',
        text: '#94A3B8',
        textActive: '#2DD4BF',
        border: 'rgba(45, 212, 191, 0.2)',
        logo: '#2DD4BF',
    },

    // Card colors
    card: {
        background: '#152238',
        hover: '#1A2942',
        border: 'rgba(45, 212, 191, 0.1)',
    },

    // Input colors
    input: {
        background: '#1A2942',
        border: 'rgba(148, 163, 184, 0.2)',
        focus: '#2DD4BF',
        text: '#F8FAFC',
        placeholder: '#64748B',
    },

    // Shadow colors
    shadow: {
        small: 'rgba(0, 0, 0, 0.2)',
        medium: 'rgba(0, 0, 0, 0.3)',
        large: 'rgba(0, 0, 0, 0.4)',
        glow: 'rgba(45, 212, 191, 0.3)',
    },
};

export type DarkModeColors = typeof darkModeColors;
