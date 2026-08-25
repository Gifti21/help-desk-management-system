import React from 'react';
import { BUTTONS, ERROR } from '@/lib/colors';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const getVariantStyles = () => {
    if (disabled || loading) {
      return {
        backgroundColor: BUTTONS.disabled,
        color: BUTTONS.disabledText,
        borderColor: 'transparent',
        cursor: 'not-allowed',
      };
    }

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: BUTTONS.primary,
          color: BUTTONS.primaryText,
          borderColor: 'transparent',
        };
      case 'secondary':
        return {
          backgroundColor: BUTTONS.hover,
          color: BUTTONS.hoverText,
          borderColor: 'transparent',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: BUTTONS.primary,
          borderColor: BUTTONS.primary,
          borderWidth: '1px',
          borderStyle: 'solid',
        };
      case 'danger':
        return {
          backgroundColor: ERROR.text,
          color: '#FFFFFF',
          borderColor: 'transparent',
        };
      default:
        return {};
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-semibold',
    md: 'px-4 py-2 text-sm font-semibold',
    lg: 'px-6 py-3 text-base font-semibold',
  }[size];

  return (
    <button
      disabled={disabled || loading}
      className={`rounded-lg font-medium transition-all duration-150 inline-flex items-center justify-center gap-2 ${sizeClasses} ${className}`}
      style={{
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
};