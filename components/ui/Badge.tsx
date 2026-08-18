import React from 'react';
import { FONT_FAMILY, CAPTION_REGULAR } from '@/lib/fonts';

interface BadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = '#16332B',
  backgroundColor = '#E5F9F6',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 ${className}`}
      style={{
        backgroundColor,
        color,
        fontFamily: FONT_FAMILY.primary,
        fontSize: CAPTION_REGULAR.size,
        fontWeight: CAPTION_REGULAR.weight,
        lineHeight: CAPTION_REGULAR.lineHeight,
      }}
    >
      {label}
    </span>
  );
};
import { HTMLAttributes } from 'react';
import { TEAL_PRIMARY, LIGHT_TEAL_BADGE, BODY_TEXT_GREY, BORDER_GREY } from '@/lib/colors';
import { CAPTION_REGULAR, FONT_FAMILY, FONT_WEIGHT } from '@/lib/fonts';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'teal' | 'white' | 'grey';
}

const variantStyles = {
  teal: `border border-[${TEAL_PRIMARY}]/45 bg-[${TEAL_PRIMARY}]/10 text-[${LIGHT_TEAL_BADGE}]`,
  white: 'border border-white/20 bg-white/10 text-white/85',
  grey: `border border-[${BORDER_GREY}] bg-white text-[${BODY_TEXT_GREY}]`,
};

export function Badge({ variant = 'teal', className = '', children, ...props }: BadgeProps) {
  const baseStyles = 'inline-block rounded-full px-3 py-1';
  
  return (
    <span 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`} 
      style={{
        fontFamily: FONT_FAMILY.primary,
        fontSize: CAPTION_REGULAR.size,
        lineHeight: CAPTION_REGULAR.lineHeight,
        fontWeight: CAPTION_REGULAR.weight,
        letterSpacing: CAPTION_REGULAR.letterSpacing,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
