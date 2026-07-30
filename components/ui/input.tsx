import React from 'react';
import { useTheme } from '../providers/ThemeProvider';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', type, style, ...props }, ref) => {
        const { colors: theme } = useTheme();

        return (
            <input
                type={type}
                className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-2 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${className}`}
                style={{
                    backgroundColor: theme.card,
                    borderColor: theme.cardBorder,
                    color: theme.foreground,
                    ...style
                }}
                ref={ref}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';