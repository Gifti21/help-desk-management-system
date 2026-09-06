"use client";

import React from "react";

type PaginationBarProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

export function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
}: PaginationBarProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 py-4 px-6 bg-white border-t border-slate-200">
      <button
        type="button"
        aria-label="Previous page"
        onClick={onPrevious}
        disabled={!hasPrevious}
        className={`px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors ${
          hasPrevious
            ? "text-emerald-700 hover:text-emerald-900 cursor-pointer"
            : "text-slate-300 cursor-not-allowed"
        }`}
      >
        Prev
      </button>

      <div className="flex items-center gap-1.5">
        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              type="button"
              aria-label={`Go to page ${p}`}
              aria-current={isActive ? "page" : undefined}
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                isActive
                  ? "bg-[#1b3a34] text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-100 cursor-pointer"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Next page"
        onClick={onNext}
        disabled={!hasNext}
        className={`px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-colors ${
          hasNext
            ? "text-emerald-700 hover:text-emerald-900 cursor-pointer"
            : "text-slate-300 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
}
