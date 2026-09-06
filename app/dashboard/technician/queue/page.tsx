"use client";

import React, { useState, useMemo } from "react";
import { TicketFilters } from "@/components/tickets/TicketFilters";
import { TicketTable } from "@/components/tickets/TicketTable";
import { TicketDrawer } from "@/components/dashboard/TicketDrawer";
import { useTickets } from "@/context/TicketContext";
import { useAuth } from "@/hooks/useAuth";
import { usePagination } from "@/hooks/usePagination";
import { Ticket } from "@/types/ticket";
import { ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

export default function AssignedQueuePage() {
  const { user } = useAuth();
  const { tickets, updateTicketStatus, updateTicketPriority, addComment } =
    useTickets();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [scopeFilter, setScopeFilter] = useState<"ALL" | "ASSIGNED_TO_ME">(
    "ASSIGNED_TO_ME",
  );
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Filter queue items assigned to this support agent or all queue
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesScope = scopeFilter === "ALL" || t.assigneeId === user?.id;
      const matchesSearch =
        searchQuery === "" ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.creatorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
      const matchesPriority =
        priorityFilter === "ALL" || t.priority === priorityFilter;
      const matchesDepartment =
        departmentFilter === "ALL" ||
        (t.category || t.department || "")
          .toString()
          .toLowerCase()
          .includes(departmentFilter.toLowerCase());

      return (
        matchesScope &&
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesDepartment
      );
    });
  }, [
    tickets,
    scopeFilter,
    searchQuery,
    statusFilter,
    priorityFilter,
    departmentFilter,
    user?.id,
  ]);

  // Enforces strictly 5 items per page
  const pagination = usePagination({
    totalItems: filteredTickets.length,
    pageSize: 5,
  });

  const visibleTickets = useMemo(
    () => pagination.paginate(filteredTickets),
    [filteredTickets, pagination],
  );

  const selectedTicket = useMemo(() => {
    return tickets.find((t) => t.id === selectedTicketId) || null;
  }, [tickets, selectedTicketId]);

  const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto bg-[#F4F7F6] min-h-screen">
      {/* Queue Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Support Agent Assigned Tickets
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />{" "}
              {user?.name || "Support Agent"}
              Queue
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Filter, inspect, update statuses, add comments, and re-open resolved
            tickets across system departments.
          </p>
        </div>
      </div>

      {/* Queue Filter Toolbar */}
      <div className="space-y-4">
        <TicketFilters
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          status={statusFilter}
          priority={priorityFilter}
          department={departmentFilter}
          onStatusChange={setStatusFilter}
          onPriorityChange={setPriorityFilter}
          onDepartmentChange={setDepartmentFilter}
          scope={scopeFilter}
          onScopeChange={setScopeFilter}
          onReset={() => {
            setStatusFilter("ALL");
            setPriorityFilter("ALL");
            setDepartmentFilter("ALL");
            setScopeFilter("ALL");
            setSearchQuery("");
          }}
        />
      </div>

      {/* Ticket List Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <TicketTable
          tickets={visibleTickets}
          onSelectTicket={(ticket: Ticket) => setSelectedTicketId(ticket.id)}
        />

        {/* Minimalist Professional Dot Pagination Footer */}
        {pagination.totalPages > 1 ? (
          <div className="flex items-center justify-center px-6 py-4 bg-white border-t border-slate-200">
            <div className="flex items-center gap-3">
              <button
                onClick={pagination.previousPage}
                disabled={!pagination.hasPrevious}
                className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                  pagination.hasPrevious
                    ? "text-slate-700 hover:bg-slate-100 cursor-pointer"
                    : "text-slate-300 cursor-not-allowed"
                }`}
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {pages.map((p) => {
                  const isActive = p === pagination.currentPage;
                  return (
                    <button
                      key={p}
                      onClick={() => pagination.setPage(p)}
                      aria-label={`Page ${p}`}
                      className={`transition-all rounded-full ${
                        isActive
                          ? "w-6 h-2.5 bg-[#2FD9C4]"
                          : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400 cursor-pointer"
                      }`}
                    />
                  );
                })}
              </div>

              <button
                onClick={pagination.nextPage}
                disabled={!pagination.hasNext}
                className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                  pagination.hasNext
                    ? "text-slate-700 hover:bg-slate-100 cursor-pointer"
                    : "text-slate-300 cursor-not-allowed"
                }`}
                aria-label="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Detail Inspection Drawer */}
      <TicketDrawer
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicketId(null)}
        onUpdateStatus={(ticketId, status) =>
          updateTicketStatus(ticketId, status)
        }
        onUpdatePriority={(ticketId, priority) =>
          updateTicketPriority(ticketId, priority)
        }
        onAddComment={(ticketId, content) => {
          addComment(ticketId, content, user?.name || "Support Agent");
        }}
      />
    </div>
  );
}
