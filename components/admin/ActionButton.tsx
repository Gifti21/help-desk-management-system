'use client';

import React from 'react';
import { Button } from '../ui/button';
import { useTheme } from '../providers/ThemeProvider';
import { fonts } from '@/lib/fonts';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export function ActionButton({
    variant = 'primary',
    size = 'md',
    icon: Icon,
    children,
    onClick,
    className = '',
    disabled = false
}: ActionButtonProps) {
    const { colors: theme, isDark } = useTheme();

    const getButtonStyles = () => {
        const baseStyle = {
            fontFamily: fonts.fontFamily.primary,
            borderRadius: '6px',
            transition: 'all 0.2s ease-in-out',
            border: 'none'
        };

        const sizeStyles = {
            sm: {
                fontSize: fonts.button.sm.size,
                fontWeight: fonts.button.sm.weight,
                lineHeight: fonts.button.sm.lineHeight,
                padding: '8px 12px'
            },
            md: {
                fontSize: fonts.button.regular.size,
                fontWeight: fonts.button.regular.weight,
                lineHeight: fonts.button.regular.lineHeight,
                padding: '10px 16px'
            },
            lg: {
                fontSize: fonts.button.lg.size,
                fontWeight: fonts.button.lg.weight,
                lineHeight: fonts.button.lg.lineHeight,
                padding: '12px 20px'
            }
        };

        const variantStyles = {
            primary: {
                backgroundColor: disabled ? theme.backgroundTertiary : theme.primary,
                color: disabled ? theme.foregroundMuted : (isDark ? '#0F172A' : '#16332B'),
            },
            secondary: {
                backgroundColor: theme.secondary,
                color: theme.secondaryForeground,
            },
            outline: {
                backgroundColor: 'transparent',
                color: theme.primary,
                border: `1px solid ${theme.primary}`,
            },
            ghost: {
                backgroundColor: 'transparent',
                color: isDark ? theme.foreground : '#334155', // Dark gray for light mode, white for dark mode
            }
        };

        return {
            ...baseStyle,
            ...sizeStyles[size],
            ...variantStyles[variant]
        };
    };

    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center ${className}`}
            style={getButtonStyles()}
        >
            {Icon && <Icon className="h-4 w-4 mr-2" />}
            {children}
        </Button>
    );
}