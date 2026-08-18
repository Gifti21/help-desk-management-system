"use client";

import React from "react";
import { Ticket } from "@/types/ticket";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Eye } from "lucide-react";

interface TicketRowProps {
  ticket: Ticket;
  onSelectTicket: (ticket: Ticket) => void;
}

export const TicketRow: React.FC<TicketRowProps> = ({ ticket, onSelectTicket }) => {
  return (
    <tr className="hover:bg-slate-50 transition-colors text-xs border-b border-slate-100">
      <td className="p-3.5 font-mono text-[#0E2621] font-bold">{ticket.ticketNumber || ticket.id}</td>
      <td className="p-3.5 font-bold text-slate-900 max-w-xs truncate">{ticket.title}</td>
      <td className="p-3.5 text-slate-600 font-medium">{ticket.creatorName || "Employee"}</td>
      <td className="p-3.5 text-slate-600">{(ticket.category || ticket.department || "IT Support").toString()}</td>
      <td className="p-3.5">
        <StatusBadge type="priority" value={ticket.priority} />
      </td>
      <td className="p-3.5">
        <StatusBadge type="status" value={ticket.status} />
      </td>
      <td className="p-3.5 text-right">
        <button
          onClick={() => onSelectTicket(ticket)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-semibold rounded-lg transition-colors cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 text-emerald-700" />
          <span>Inspect</span>
        </button>
      </td>
    </tr>
  );
};