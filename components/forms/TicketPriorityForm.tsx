"use client";

import React, { useState, useEffect } from "react";
import { Priority } from "@/types/ticket";

interface TicketPriorityFormProps {
  ticketId: string;
  currentPriority: Priority;
  onUpdatePriority: (id: string, newPriority: Priority) => void;
  isLoading?: boolean;
}

export const TicketPriorityForm: React.FC<TicketPriorityFormProps> = ({
  ticketId,
  currentPriority,
  onUpdatePriority,
  isLoading = false,
}) => {
  const [selectedPriority, setSelectedPriority] = useState<Priority>(currentPriority);

  useEffect(() => {
    setSelectedPriority(currentPriority);
  }, [currentPriority]);

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextPriority = e.target.value as Priority;
    setSelectedPriority(nextPriority);
    onUpdatePriority(ticketId, nextPriority);
  };

  return (
    <div className="flex flex-col justify-between p-3 bg-white border border-slate-200 rounded-xl w-full shadow-xs">
      <div>
        <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 font-bold">
          Priority Level Triage
        </label>
        <select
          value={selectedPriority}
          onChange={handlePriorityChange}
          disabled={isLoading}
          className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg p-2 focus:outline-none focus:border-[#0E2621] transition-colors"
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>
      </div>
      <p className="text-[10px] text-slate-500 pt-1 font-mono">
        SLA Target: {selectedPriority === "CRITICAL" ? "1 hr response" : selectedPriority === "HIGH" ? "4 hrs response" : "24 hrs response"}
      </p>
    </div>
  );
};