"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Ticket } from "@/types/ticket";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface DataTableProps {
  tickets: Ticket[];
  onInspect: (ticketId: string) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ tickets, onInspect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Ticket>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 1. Search Functionality (Title, Ticket Number, Category, Creator)
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const query = searchQuery.toLowerCase();
      const catStr = (t.category || t.department || "")
        .toString()
        .toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(query);
      const matchNumber = (t.ticketNumber || t.id)
        .toLowerCase()
        .includes(query);
      const matchCategory = catStr.includes(query);
      const matchCreator = (t.creatorName || t.creatorEmail || "")
        .toLowerCase()
        .includes(query);

      return matchTitle || matchNumber || matchCategory || matchCreator;
    });
  }, [tickets, searchQuery]);

  // 2. Sorting Logic
  const sortedTickets = useMemo(() => {
    return [...filteredTickets].sort((a, b) => {
      let valA = (a[sortField] ?? "").toString();
      let valB = (b[sortField] ?? "").toString();

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredTickets, sortField, sortOrder]);

  // 3. Pagination Logic
  const totalPages = Math.ceil(sortedTickets.length / itemsPerPage) || 1;
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedTickets.slice(start, start + itemsPerPage);
  }, [sortedTickets, currentPage]);

  const toggleSort = (field: keyof Ticket) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search ticket ID, title, requester..."
          className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0E2621]"
        />
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[10px] border-b border-slate-200">
            <tr>
              <th
                className="p-3 cursor-pointer hover:text-slate-900"
                onClick={() => toggleSort("ticketNumber")}
              >
                <div className="flex items-center gap-1">
                  ID <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                className="p-3 cursor-pointer hover:text-slate-900"
                onClick={() => toggleSort("title")}
              >
                <div className="flex items-center gap-1">
                  Subject <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3">Requester</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedTickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-500">
                  No matching tickets found.
                </td>
              </tr>
            ) : (
              paginatedTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="transition-colors hover:bg-[#dcfce7]"
                >
                  <td className="p-3 font-mono text-[#0E2621] font-bold">
                    {ticket.ticketNumber || ticket.id}
                  </td>
                  <td className="p-3 font-bold text-slate-900 max-w-xs truncate">
                    {ticket.title}
                  </td>
                  <td className="p-3 text-slate-600">
                    {ticket.creatorName || "Employee"}
                  </td>
                  <td className="p-3">
                    <StatusBadge type="priority" value={ticket.priority} />
                  </td>
                  <td className="p-3">
                    <StatusBadge type="status" value={ticket.status} />
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onInspect(ticket.id)}
                      className="text-xs text-emerald-800 hover:underline font-bold bg-slate-100 px-2.5 py-1 rounded border border-slate-300"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-slate-600 pt-2 font-mono">
        <span>
          Showing Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg bg-white border border-slate-300 disabled:opacity-50 hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4 text-slate-700" />
          </button>
          <button
            type="button"
            aria-label="Next page"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg bg-white border border-slate-300 disabled:opacity-50 hover:bg-slate-50"
          >
            <ChevronRight className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      </div>
    </div>
  );
};
