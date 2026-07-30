"use client";

import React, { useState, useMemo } from "react";
import { TicketFilters } from "@/components/tickets/TicketFilters";
import { TicketTable } from "@/components/tickets/TicketTable";
import { TicketDrawer } from "@/components/dashboard/TicketDrawer";
import { TicketProvider, useTickets } from "@/context/TicketContext";
import { Ticket } from "@/types/ticket";

function AssignedQueueContent() {
  const { tickets, updateTicketStatus, updateTicketPriority, addComment } = useTickets();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [scopeFilter, setScopeFilter] = useState<"ALL" | "ASSIGNED_TO_ME">("ASSIGNED_TO_ME");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

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
    <div className="min-h-screen bg-[#F4F7F6] text-slate-900 p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto transition-colors">
      {/* Header Container with clean white surface, border, and sharp typography */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="border-b border-slate-100 pb-4">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Assigned Ticket Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Support Agent dashboard view for filtering, inspecting, and managing tickets.
          </p>
        </div>
      </div>

      {/* Filters Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
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

      {/* Ticket Table Wrapper Card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6">
        <TicketTable 
          tickets={filteredTickets}
          onSelectTicket={(ticket: Ticket) => setSelectedTicketId(ticket.id)}
        />
      </div>

      <TicketDrawer
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicketId(null)}
        onUpdateStatus={(id, status) => updateTicketStatus(id, status)}
        onUpdatePriority={(id, priority) => updateTicketPriority(id, priority)}
        onAddComment={(id, content) => {
          addComment(id, content, "Bontu");
        }}
      />
    </div>
  );
}

export default function AssignedQueuePage() {
  return (
    <TicketProvider>
      <AssignedQueueContent />
    </TicketProvider>
  );
}