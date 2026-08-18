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
          backgroundColor: BUTTONS.hover, // Using secondary button hover tone
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
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { BUTTONS, TEAL_PRIMARY, DARK_GREEN } from '@/lib/colors';
import { BUTTON_SM, BUTTON_REGULAR, BUTTON_LG, FONT_FAMILY, FONT_WEIGHT } from '@/lib/fonts';

type ButtonVariant = 'primary' | 'secondary';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: 'px-3 py-2',
  md: 'px-5 py-2.5',
  lg: 'px-6 py-3.5',
};

const sizeFontStyles = {
  sm: BUTTON_SM,
  md: BUTTON_REGULAR,
  lg: BUTTON_LG,
};

const variantStyles = {
  primary: `bg-[${BUTTONS.primary}] text-[${BUTTONS.primaryText}] hover:bg-[${BUTTONS.hover}]`,
  secondary: 'border border-white/20 bg-white/10 text-white/80 hover:bg-white/15',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth = false, className = '', children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed';

    const disabledStyles = disabled
      ? `bg-[${BUTTONS.disabled}] text-[${BUTTONS.disabledText}]`
      : '';

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyles} ${widthStyle} ${className}`}
        disabled={disabled}
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: sizeFontStyles[size].size,
          lineHeight: sizeFontStyles[size].lineHeight,
          fontWeight: sizeFontStyles[size].weight,
          letterSpacing: sizeFontStyles[size].letterSpacing,
          backgroundColor: variant === 'primary' && !disabled ? BUTTONS.primary : undefined,
          color: variant === 'primary' && !disabled ? BUTTONS.primaryText : undefined,
          '--tw-ring-color': TEAL_PRIMARY,
          '--tw-ring-offset-color': DARK_GREEN,
        } as React.CSSProperties}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
