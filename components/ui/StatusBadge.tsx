import React from 'react';
import { Status, Priority } from '@/types/ticket';

interface StatusBadgeProps {
  type: 'status' | 'priority';
  value: Status | Priority | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value }) => {
  const getStyles = () => {
    const val = (value || '').toString().toUpperCase();
    if (type === 'status') {
      switch (val) {
        case 'OPEN':
          return 'bg-sky-50 text-sky-700 border-sky-200';
        case 'IN_PROGRESS':
          return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'PENDING':
          return 'bg-purple-50 text-purple-700 border-purple-200';
        case 'RESOLVED':
          return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case 'CLOSED':
          return 'bg-slate-100 text-slate-700 border-slate-300';
        default:
          return 'bg-slate-100 text-slate-700 border-slate-300';
      }
    } else {
      switch (val) {
        case 'CRITICAL':
          return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
        case 'HIGH':
          return 'bg-orange-50 text-orange-700 border-orange-200 font-semibold';
        case 'MEDIUM':
          return 'bg-yellow-50 text-yellow-800 border-yellow-200';
        case 'LOW':
          return 'bg-teal-50 text-teal-700 border-teal-200';
        default:
          return 'bg-slate-100 text-slate-700 border-slate-300';
      }
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold border uppercase tracking-wider ${getStyles()}`}
    >
      {(value || '').toString().replace('_', ' ')}
    </span>
  );
};