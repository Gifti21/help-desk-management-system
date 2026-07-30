'use client';

import { useMemo, useState } from 'react';

type UsePaginationOptions = {
  totalItems: number;
  pageSize?: number;
  initialPage?: number;
};

type UsePaginationResult = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  hasPrevious: boolean;
  hasNext: boolean;
  setPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  paginate: <T>(items: T[]) => T[];
};

export function usePagination({
  totalItems,
  pageSize = 10,
  initialPage = 1,
}: UsePaginationOptions): UsePaginationResult {
  const [page, setPageState] = useState(initialPage);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const setPage = (nextPage: number) => {
    setPageState(Math.min(Math.max(nextPage, 1), totalPages));
  };

  const paginate = <T,>(items: T[]) => items.slice(startIndex, endIndex);

  return useMemo(
    () => ({
      page: safePage,
      pageSize,
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      hasPrevious: safePage > 1,
      hasNext: safePage < totalPages,
      setPage,
      nextPage: () => setPage(safePage + 1),
      previousPage: () => setPage(safePage - 1),
      paginate,
    }),
    [endIndex, pageSize, safePage, startIndex, totalItems, totalPages]
  );
}
