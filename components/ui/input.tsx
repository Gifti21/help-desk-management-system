import React from 'react';
import {
  BODY_TEXT_GREY,
  BORDER_GREY,
  PAGE_BACKGROUND,
  PRIMARY_TEXT,
  PLACEHOLDER_TEXT,
  INPUT_BORDER,
  TEAL_PRIMARY,
} from '@/lib/colors';
import { BODY_SM, CAPTION_REGULAR, FONT_FAMILY, INPUT_REGULAR, FONT_WEIGHT } from '@/lib/fonts';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconPosition?: 'left' | 'right';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon: Icon, iconPosition = 'left', className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    const InputWrapper = Icon ? (
      <div
        className="flex items-center gap-3 rounded-xl border px-4 py-3 transition focus-within:ring-2"
        style={{
          borderColor: error ? '#DC2626' : INPUT_BORDER,
          backgroundColor: PAGE_BACKGROUND,
        }}
      >
        {Icon && iconPosition === 'left' && <Icon className="h-5 w-5" style={{ color: PLACEHOLDER_TEXT }} />}
        <input
          ref={ref}
          id={inputId}
          className="w-full bg-transparent outline-none"
          style={{
            color: PRIMARY_TEXT,
            fontFamily: FONT_FAMILY.primary,
            fontSize: INPUT_REGULAR.size,
            lineHeight: INPUT_REGULAR.lineHeight,
            fontWeight: FONT_WEIGHT.medium,
          }}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {Icon && iconPosition === 'right' && <Icon className="h-5 w-5" style={{ color: PLACEHOLDER_TEXT }} />}
      </div>
    ) : (
      <input
        ref={ref}
        id={inputId}
        className="w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2"
        style={{
          backgroundColor: PAGE_BACKGROUND,
          borderColor: error ? '#DC2626' : BORDER_GREY,
          color: PRIMARY_TEXT,
          fontFamily: FONT_FAMILY.primary,
          fontSize: INPUT_REGULAR.size,
          lineHeight: INPUT_REGULAR.lineHeight,
        }}
        aria-invalid={Boolean(error)}
        {...props}
      />
    );

    return (
      <div className={`space-y-1.5 ${className}`}>
        {label ? (
          <label
            htmlFor={inputId}
            style={{
              color: BODY_TEXT_GREY,
              fontFamily: FONT_FAMILY.primary,
              fontSize: CAPTION_REGULAR.size,
              fontWeight: CAPTION_REGULAR.weight,
            }}
          >
            {label}
          </label>
        ) : null}

        {InputWrapper}

        {error ? (
          <p style={{ color: '#DC2626', fontSize: CAPTION_REGULAR.size }}>{error}</p>
        ) : hint ? (
          <p style={{ color: BODY_TEXT_GREY, fontSize: BODY_SM.size }}>{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';