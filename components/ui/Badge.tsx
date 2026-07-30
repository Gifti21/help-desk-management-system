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
