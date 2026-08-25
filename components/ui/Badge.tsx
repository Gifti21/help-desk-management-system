import React from 'react';
import { TEAL_PRIMARY, LIGHT_TEAL_BADGE, BODY_TEXT_GREY, BORDER_GREY } from '@/lib/colors';
import { CAPTION_REGULAR, FONT_FAMILY } from '@/lib/fonts';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'teal' | 'white' | 'grey';
  children: React.ReactNode;
}

export function Badge({ variant = 'teal', className = '', children, ...props }: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'teal':
        return {
          borderColor: TEAL_PRIMARY + '73', // 45% opacity
          backgroundColor: TEAL_PRIMARY + '1A', // 10% opacity
          color: LIGHT_TEAL_BADGE,
          borderWidth: '1px',
          borderStyle: 'solid',
        };
      case 'white':
        return {
          borderColor: 'rgba(255, 255, 255, 0.2)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.85)',
          borderWidth: '1px',
          borderStyle: 'solid',
        };
      case 'grey':
        return {
          borderColor: BORDER_GREY,
          backgroundColor: 'white',
          color: BODY_TEXT_GREY,
          borderWidth: '1px',
          borderStyle: 'solid',
        };
      default:
        return {};
    }
  };

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 ${className}`}
      style={{
        ...getVariantStyles(),
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