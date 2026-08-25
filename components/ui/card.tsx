import React from 'react';
import { BORDER_GREY, CARD_BACKGROUND, PRIMARY_TEXT, BODY_TEXT_GREY } from '@/lib/colors';
import { FONT_FAMILY, HEADING_MD, BODY_REGULAR } from '@/lib/fonts';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  children: React.ReactNode;
}

export function Card({ variant = 'default', className = '', children, ...props }: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          borderColor: BORDER_GREY,
          backgroundColor: 'white',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          borderWidth: '1px',
          borderStyle: 'solid',
        };
      case 'bordered':
        return {
          borderColor: BORDER_GREY,
          backgroundColor: CARD_BACKGROUND,
          borderWidth: '1px',
          borderStyle: 'solid',
        };
      case 'default':
      default:
        return {
          borderColor: BORDER_GREY,
          backgroundColor: 'white',
          borderWidth: '1px',
          borderStyle: 'solid',
        };
    }
  };

  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        ...getVariantStyles(),
        fontFamily: FONT_FAMILY.primary,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

// Card Header Component
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({ className = '', children, ...props }: CardHeaderProps) {
  return (
    <div
      className={`p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Card Title Component
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function CardTitle({ className = '', children, ...props }: CardTitleProps) {
  return (
    <h3
      className={`${className}`}
      style={{
        fontFamily: FONT_FAMILY.primary,
        fontSize: HEADING_MD.size,
        lineHeight: HEADING_MD.lineHeight,
        fontWeight: HEADING_MD.weight,
        letterSpacing: HEADING_MD.letterSpacing,
        color: PRIMARY_TEXT,
      }}
      {...props}
    >
      {children}
    </h3>
  );
}

// Card Content Component
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({ className = '', children, ...props }: CardContentProps) {
  return (
    <div
      className={`p-6 pt-0 ${className}`}
      style={{
        fontFamily: FONT_FAMILY.primary,
        fontSize: BODY_REGULAR.size,
        lineHeight: BODY_REGULAR.lineHeight,
        color: BODY_TEXT_GREY,
      }}
      {...props}
    >
      {children}
    </div>
  );
}