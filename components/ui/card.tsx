import React from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { spacing } from '@/lib/spacing';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Card({ className = '', style, ...props }: CardProps) {
    const { colors: theme } = useTheme();

    return (
        <div
            className={`rounded-lg border shadow-sm transition-colors ${className}`}
            style={{
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
                ...style
            }}
            {...props}
        />
    );
}

export function CardHeader({ className = '', ...props }: CardProps) {
    return (
        <div
            className={`flex flex-col ${className}`}
            style={{ padding: spacing.card.padding, paddingBottom: spacing.card.gapSmall }}
            {...props}
        />
    );
}

export function CardTitle({ className = '', ...props }: CardProps) {
    const { colors: theme } = useTheme();

    return (
        <h3
            className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
            style={{ color: theme.foreground }}
            {...props}
        />
    );
}

export function CardDescription({ className = '', ...props }: CardProps) {
    const { colors: theme } = useTheme();

    return (
        <p
            className={`text-sm ${className}`}
            style={{ color: theme.foregroundMuted, marginTop: spacing.xs }}
            {...props}
        />
    );
}

export function CardContent({ className = '', ...props }: CardProps) {
    return (
        <div
            className={`${className}`}
            style={{ padding: spacing.card.padding, paddingTop: 0 }}
            {...props}
        />
    );
}

export function CardFooter({ className = '', ...props }: CardProps) {
    return (
        <div
            className={`flex items-center ${className}`}
            style={{ padding: spacing.card.padding, paddingTop: 0, gap: spacing.button.gap }}
            {...props}
        />
    );
}
