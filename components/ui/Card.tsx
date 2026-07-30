import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', style, ...props }) => {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-xs transition-colors ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};