"use client";

import React, { useState, useMemo } from "react";
import { TicketFilters } from "@/components/tickets/TicketFilters";
import { TicketTable } from "@/components/tickets/TicketTable";
import { TicketDrawer } from "@/components/dashboard/TicketDrawer";
import { useTickets } from "@/context/TicketContext";
import { Ticket } from "@/types/ticket";
import { Inbox, ShieldCheck } from "lucide-react";

export default function AssignedQueuePage() {
  const { tickets, updateTicketStatus, updateTicketPriority, addComment } = useTickets();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [scopeFilter, setScopeFilter] = useState<"ALL" | "ASSIGNED_TO_ME">("ASSIGNED_TO_ME");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Filter queue items assigned to this support agent or all queue
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesScope = scopeFilter === "ALL" || t.assigneeId === "agent_bontu";
      const matchesSearch =
        searchQuery === "" ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.creatorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
      const matchesPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
      const matchesDepartment =
        departmentFilter === "ALL" ||
        (t.category || t.department || "").toString().toLowerCase().includes(departmentFilter.toLowerCase());

      return matchesScope && matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
    });
  }, [tickets, scopeFilter, searchQuery, statusFilter, priorityFilter, departmentFilter]);

  const selectedTicket = useMemo(() => {
    return tickets.find((t) => t.id === selectedTicketId) || null;
  }, [tickets, selectedTicketId]);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto bg-[#F4F7F6] min-h-screen">
      {/* Queue Header */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Support Agent Ticket Queue</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Bontu Queue
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Filter, inspect, update statuses, add comments, and re-open resolved tickets across system departments.
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

      {/* Ticket List Table */}
      <TicketTable
        tickets={filteredTickets}
        onSelectTicket={(ticket: Ticket) => setSelectedTicketId(ticket.id)}
      />

      {/* Detail Inspection Drawer */}
      <TicketDrawer
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicketId(null)}
        onUpdateStatus={(ticketId, status) => updateTicketStatus(ticketId, status)}
        onUpdatePriority={(ticketId, priority) => updateTicketPriority(ticketId, priority)}
        onAddComment={(ticketId, content) => {
          addComment(ticketId, content, "Bontu");
        }}
      />
    </div>
  );
}