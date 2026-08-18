"use client";

import React, { useState, useEffect } from "react";
import { Status } from "@/types/ticket";
import { Lock, RotateCcw } from "lucide-react";
import { useTickets } from "@/context/TicketContext";

interface TicketStatusFormProps {
  ticketId: string;
  currentStatus: Status;
  onUpdateStatus: (id: string, newStatus: Status) => void;
  isLoading?: boolean;
}

export const TicketStatusForm: React.FC<TicketStatusFormProps> = ({
  ticketId,
  currentStatus,
  onUpdateStatus,
  isLoading = false,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<Status>(currentStatus);
  const { reopenTicket } = useTickets();

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as Status;
    setSelectedStatus(nextStatus);
    onUpdateStatus(ticketId, nextStatus);
  };

  const handleCloseTicket = () => {
    setSelectedStatus("CLOSED");
    onUpdateStatus(ticketId, "CLOSED");
  };

  const handleReopenTicket = () => {
    reopenTicket(ticketId);
  };

  return (
    <div className="flex flex-col justify-between gap-2 p-3 bg-white border border-slate-200 rounded-xl w-full shadow-xs">
      <div>
        <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 font-bold">
          Ticket Status Lifecycle
        </label>
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          disabled={isLoading}
          className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-2 focus:outline-none focus:border-[#0E2621] transition-colors"
        >
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="PENDING">PENDING</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </div>

      <div className="pt-1 flex items-center justify-end">
        {currentStatus !== "CLOSED" ? (
          <button
            type="button"
            onClick={handleCloseTicket}
            disabled={isLoading}
            className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-rose-600" />
            <span>Close Ticket</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReopenTicket}
            disabled={isLoading}
            className="w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-[#0E2621] text-white hover:bg-[#163831] transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#2FD9C4]" />
            <span>Re-open Ticket</span>
          </button>
        )}
      </div>
    </div>
  );
};