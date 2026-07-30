"use client";

import React from "react";
import { Ticket } from "@/types/ticket";
import { TicketRow } from "./TicketRow";
import { Inbox } from "lucide-react";

interface TicketTableProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
}

export const TicketTable: React.FC<TicketTableProps> = ({ tickets, onSelectTicket }) => {
  if (!tickets || tickets.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3 shadow-xs">
        <div className="p-3 bg-slate-100 border border-slate-200 text-slate-500 w-fit mx-auto rounded-xl">
          <Inbox className="w-6 h-6 text-emerald-700" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          No Tickets Found
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          No assigned tickets match your current search, status, or department filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-slate-700">
          <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-3.5">Ticket ID</th>
              <th className="p-3.5">Subject / Title</th>
              <th className="p-3.5">Requester</th>
              <th className="p-3.5">Department</th>
              <th className="p-3.5">Priority</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                onSelectTicket={onSelectTicket}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};