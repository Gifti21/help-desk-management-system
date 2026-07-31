'use client';

import React from 'react';
import { Button } from '../ui/button';
import { useTheme } from '../providers/ThemeProvider';
import { fonts } from '@/lib/fonts';
import { spacing } from '@/lib/spacing';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger' | 'warning' | 'info';
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
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
        };

        const sizeStyles = {
            sm: {
                fontSize: fonts.button.sm.size,
                fontWeight: fonts.button.sm.weight,
                lineHeight: fonts.button.sm.lineHeight,
                padding: spacing.button.paddingSm
            },
            md: {
                fontSize: fonts.button.regular.size,
                fontWeight: fonts.button.regular.weight,
                lineHeight: fonts.button.regular.lineHeight,
                padding: spacing.button.paddingMd
            },
            lg: {
                fontSize: fonts.button.lg.size,
                fontWeight: fonts.button.lg.weight,
                lineHeight: fonts.button.lg.lineHeight,
                padding: spacing.button.paddingLg
            }
        };

        const variantStyles = {
            primary: {
                backgroundColor: theme.primary,
                color: isDark ? '#0F172A' : '#16332B',
                border: 'none',
            },
            secondary: {
                backgroundColor: isDark ? 'rgba(148, 163, 184, 0.1)' : '#F1F5F9',
                color: theme.foreground,
                border: 'none',
            },
            outline: {
                backgroundColor: 'transparent',
                color: theme.primary,
                border: `1px solid ${theme.primary}`,
            },
            ghost: {
                backgroundColor: 'transparent',
                color: isDark ? '#94A3B8' : '#334155',
                border: 'none',
            },
            success: {
                backgroundColor: 'transparent',
                color: '#10B981',
                border: 'none',
            },
            danger: {
                backgroundColor: 'transparent',
                color: '#EF4444',
                border: 'none',
            },
            warning: {
                backgroundColor: 'transparent',
                color: '#F59E0B',
                border: 'none',
            },
            info: {
                backgroundColor: 'transparent',
                color: '#3B82F6',
                border: 'none',
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
            className={`flex items-center hover:opacity-90 ${className}`}
            style={getButtonStyles()}
        >
            {Icon && <Icon className="h-4 w-4" style={{ marginRight: spacing.xs }} />}
            {children}
        </Button>
    );
}