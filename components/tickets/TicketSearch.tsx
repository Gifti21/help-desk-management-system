"use client";

import React from 'react';
import { Search } from 'lucide-react';

interface TicketSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export const TicketSearch: React.FC<TicketSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tickets by ID, title, or reporter..."
        className="w-full pl-10 pr-4 py-2.5 bg-[#0C1815] border border-[#1E3E35] rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#2FD9C4] transition-colors"
      />
    </div>
  );
};