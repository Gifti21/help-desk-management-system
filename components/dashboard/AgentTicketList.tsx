"use client";

import React, { useMemo, useState } from "react";
import { Ticket, Status } from "@/types/ticket";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/utils/formatDate";
import { Search, Filter, AlertCircle, RefreshCw, ArrowUpDown, Play, CheckCircle2, XCircle } from "lucide-react";

interface AgentTicketListProps {
  onStartProgress?: (ticketId: string) => void;
  onResolve?: (ticketId: string) => void;
  tickets: Ticket[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (p: string) => void;
  onSelectTicket: (ticket: Ticket) => void;
  onQuickUpdateStatus?: (ticketId: string, status: Status) => void;
  onCloseTicket?: (ticketId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function AgentTicketList({
  tickets,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onSelectTicket,
  onQuickUpdateStatus,
  onCloseTicket,
  isLoading,
  error,
  onRetry,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: AgentTicketListProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
        <AlertCircle className="mx-auto h-8 w-8 text-red-500 mb-2" />
        <p className="text-sm font-semibold">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition"
          >
            <RefreshCw size={14} />
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar - Clean White Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#1B2D2A] dark:bg-[#0F2D2A]">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-3 text-slate-400 dark:text-teal-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search ticket ID, title, or user..."
            className="w-full rounded-lg border border-slate-300 dark:border-[#1B2D2A] bg-slate-50 dark:bg-[#111C1A] pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-emerald-600 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Filter size={15} className="text-slate-500 dark:text-teal-400" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="rounded-lg border border-slate-300 dark:border-[#1B2D2A] bg-slate-50 dark:bg-[#111C1A] px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-emerald-600"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-[#1B2D2A] bg-slate-50 dark:bg-[#111C1A] px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none cursor-pointer focus:border-emerald-600"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-[#1B2D2A] dark:bg-[#111C1A]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:border-[#1B2D2A] dark:bg-[#0F2D2A] dark:text-[#C0C7C7]">
                <th className="px-6 py-3.5">Ticket ID & Title</th>
                <th className="px-6 py-3.5">Requester</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Updated</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-slate-700 dark:divide-[#1B2D2A] dark:bg-[#111C1A] dark:text-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                    Loading tickets...
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                    No tickets found assigned to you matching these filters.
                  </td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id} className="transition hover:bg-slate-50/80 dark:hover:bg-[#0F2D2A]/60">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{t.ticketNumber}</p>
                      <p className="line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{t.title}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{String(t.creatorName || '')}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{String(t.category || '')}</td>
                    <td className="px-6 py-4">
                      <StatusBadge type="priority" value={t.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge type="status" value={t.status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">{formatDate(t.updatedAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onSelectTicket(t)}
                        className="rounded-lg border border-slate-300 dark:border-[#1B2D2A] bg-white dark:bg-[#0F2D2A] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs transition hover:bg-slate-100 dark:hover:bg-teal-900/60"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && onPageChange && (
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-[#1B2D2A] px-6 py-3 bg-slate-50 dark:bg-[#0F2D2A]">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="rounded-md border border-slate-300 dark:border-[#1B2D2A] bg-white dark:bg-[#111C1A] px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="rounded-md border border-slate-300 dark:border-[#1B2D2A] bg-white dark:bg-[#111C1A] px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}