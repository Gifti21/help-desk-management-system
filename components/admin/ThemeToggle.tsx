'use client';

import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { ActionButton } from './ActionButton';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <ActionButton
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            icon={isDark ? Sun : Moon}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? 'Light' : 'Dark'}
        </ActionButton>
    );
}