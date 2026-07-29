'use client';

import { useTheme } from '@/components/providers/ThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Button } from './button';

export function ThemeToggle() {
    const { mode, isDark, setTheme } = useTheme();

    const handleToggle = () => {
        if (mode === 'light') {
            setTheme('dark');
        } else if (mode === 'dark') {
            setTheme('system');
        } else {
            setTheme('light');
        }
    };

    const getIcon = () => {
        if (mode === 'light') return Sun;
        if (mode === 'dark') return Moon;
        return Monitor;
    };

    const getLabel = () => {
        if (mode === 'light') return 'Light mode';
        if (mode === 'dark') return 'Dark mode';
        return 'System mode';
    };

    const Icon = getIcon();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            title={`Switch to ${mode === 'light' ? 'dark' : mode === 'dark' ? 'system' : 'light'} mode`}
            className="w-9 h-9 rounded-md"
            style={{
                color: isDark ? '#2DD4BF' : '#2FD9C4'
            }}
        >
            <Icon className="h-4 w-4" />
            <span className="sr-only">{getLabel()}</span>
        </Button>
    );
}

export function SimpleThemeToggle() {
    const { isDark, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            className="w-9 h-9 rounded-md"
            style={{
                color: isDark ? '#2DD4BF' : '#2FD9C4'
            }}
        >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="sr-only">{isDark ? 'Light mode' : 'Dark mode'}</span>
        </Button>
    );
}