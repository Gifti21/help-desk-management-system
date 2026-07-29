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
