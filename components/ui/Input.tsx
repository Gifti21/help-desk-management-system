import React from 'react';
import {
  BODY_TEXT_GREY,
  BORDER_GREY,
  PAGE_BACKGROUND,
  PRIMARY_TEXT,
} from '@/lib/colors';
import { BODY_SM, CAPTION_REGULAR, FONT_FAMILY, INPUT_REGULAR } from '@/lib/fonts';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

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

        <input
          ref={ref}
          id={inputId}
          className="w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-[#2FD9C4]/30"
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

        {error ? (
          <p style={{ color: '#DC2626', fontSize: CAPTION_REGULAR.size }}>{error}</p>
        ) : hint ? (
          <p style={{ color: BODY_TEXT_GREY, fontSize: BODY_SM.size }}>{hint}</p>
        ) : null}
import { InputHTMLAttributes, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { BODY_TEXT_GREY, PLACEHOLDER_TEXT, INPUT_BORDER, PAGE_BACKGROUND, TEAL_PRIMARY, PRIMARY_TEXT } from '@/lib/colors';
import { INPUT_REGULAR, FONT_FAMILY, FONT_WEIGHT } from '@/lib/fonts';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ icon: Icon, iconPosition = 'left', className = '', type = 'text', ...props }, ref) => {
    const baseStyles = 'flex items-center gap-3 rounded-2xl border px-4 py-3 transition focus-within:ring-2';

    return (
      <div
        className={baseStyles}
        style={{
          borderColor: INPUT_BORDER,
          backgroundColor: PAGE_BACKGROUND,
          '--tw-ring-color': TEAL_PRIMARY,
          '--tw-ring-color-light': 'rgba(47, 217, 196, 0.2)',
        } as React.CSSProperties}
      >
        {Icon && iconPosition === 'left' && <Icon className="h-5 w-5" style={{ color: PLACEHOLDER_TEXT }} />}
        <input
          ref={ref}
          type={type}
          className="w-full bg-transparent outline-none"
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: INPUT_REGULAR.size,
            lineHeight: INPUT_REGULAR.lineHeight,
            fontWeight: FONT_WEIGHT.medium,
            letterSpacing: INPUT_REGULAR.letterSpacing,
            color: PRIMARY_TEXT,
          }}
          {...props}
        />
        {Icon && iconPosition === 'right' && <Icon className="h-5 w-5" style={{ color: PLACEHOLDER_TEXT }} />}
      </div>
    );
  }
);

Input.displayName = 'Input';
