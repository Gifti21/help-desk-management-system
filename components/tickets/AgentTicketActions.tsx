"use client";

import React from "react";
import { Ticket, Status, Priority } from "@/types/ticket";
import { useTickets } from "@/context/TicketContext";

interface AgentTicketActionsProps {
  ticket: Ticket;
  agentName?: string;
}

export const AgentTicketActions: React.FC<AgentTicketActionsProps> = ({
  ticket,
  agentName = "Bontu",
}) => {
  const { updateTicket } = useTickets();

  const handleStatusChange = (newStatus: Status) => {
    const timestamp = new Date().toISOString();

    const newHistoryEntry = {
      id: `hist-${Date.now()}`,
      title: `Status Changed to ${newStatus}`,
      type: "STATUS_CHANGE" as const,
      description: `Status updated from ${ticket.status} to ${newStatus}`,
      timestamp,
      actor: agentName,
    };

    updateTicket(ticket.id, {
      status: newStatus,
      updatedAt: timestamp,
      history: [...(ticket.history || []), newHistoryEntry],
    });
  };

  const handlePriorityChange = (newPriority: Priority) => {
    const timestamp = new Date().toISOString();

    const newHistoryEntry = {
      id: `hist-${Date.now()}`,
      title: `Priority Changed to ${newPriority}`,
      type: "PRIORITY_CHANGE" as const,
      description: `Priority updated from ${ticket.priority} to ${newPriority}`,
      timestamp,
      actor: agentName,
    };

    updateTicket(ticket.id, {
      priority: newPriority,
      updatedAt: timestamp,
      history: [...(ticket.history || []), newHistoryEntry],
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-xs">
      <h3 className="text-xs font-mono uppercase text-emerald-800 font-bold tracking-wider">
        Agent Lifecycle Controls
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
            Update Ticket Status
          </label>
          <select
            value={ticket.status}
            onChange={(e) => handleStatusChange(e.target.value as Status)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#0E2621]"
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
            Adjust Priority
          </label>
          <select
            value={ticket.priority}
            onChange={(e) => handlePriorityChange(e.target.value as Priority)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#0E2621]"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>
    </div>
  );
};