import React from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function Button({
    className = '',
    variant = 'default',
    size = 'default',
    ...props
}: ButtonProps) {
    const { colors } = useTheme();

    const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const getVariantClasses = () => {
        switch (variant) {
            case 'default':
                return `text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] focus-visible:ring-[var(--primary)]`;
            case 'secondary':
                return `bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--secondary-hover)] focus-visible:ring-[var(--secondary)]`;
            case 'destructive':
                return `bg-[var(--error)] text-[var(--error-foreground)] hover:opacity-90 focus-visible:ring-[var(--error)]`;
            case 'outline':
                return `border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] focus-visible:ring-[var(--border)]`;
            case 'ghost':
                return `text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] focus-visible:ring-[var(--accent)]`;
            default:
                return '';
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'default':
                return 'h-10 px-4 py-2';
            case 'sm':
                return 'h-9 rounded-md px-3';
            case 'lg':
                return 'h-11 rounded-md px-8';
            case 'icon':
                return 'h-10 w-10';
            default:
                return '';
        }
    };

    return (
        <button
            className={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${className}`}
            {...props}
        />
    );
}