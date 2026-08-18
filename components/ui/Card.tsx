import React from 'react';
import { FONT_FAMILY } from '@/lib/fonts';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', style, ...props }) => {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-xs transition-colors ${className}`}
      style={{
        fontFamily: FONT_FAMILY.primary,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
import { HTMLAttributes } from 'react';
import { BORDER_GREY, CARD_BACKGROUND } from '@/lib/colors';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
}

const variantStyles = {
  default: `border border-[${BORDER_GREY}] bg-white`,
  elevated: `border border-[${BORDER_GREY}] bg-white shadow-sm`,
  bordered: `border border-[${BORDER_GREY}] bg-[${CARD_BACKGROUND}]`,
};

export function Card({ variant = 'default', className = '', children, ...props }: CardProps) {
  const baseStyles = 'rounded-2xl';
  
  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
