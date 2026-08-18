import React from 'react';
import { TEAL_PRIMARY } from '@/lib/colors';

export const Spinner: React.FC<{ className?: string; label?: string }> = ({
  className = 'h-5 w-5',
  label = 'Loading',
}) => (
  <div className="inline-flex items-center gap-2" role="status" aria-label={label}>
    <div
      className={`animate-spin rounded-full border-2 border-[#E3ECE8] ${className}`}
      style={{ borderTopColor: TEAL_PRIMARY }}
    />
    <span className="sr-only">{label}</span>
  </div>
);
