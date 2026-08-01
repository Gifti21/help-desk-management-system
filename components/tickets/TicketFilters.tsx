"use client";

import React from "react";
import { Search, RotateCcw, UserCheck, Layers } from "lucide-react";
import { BUTTONS } from "@/lib/colors";

interface TicketFiltersProps {
  searchValue: string;
  onSearchChange: React.Dispatch<React.SetStateAction<string>> | ((val: string) => void);
  status: string;
  onStatusChange: React.Dispatch<React.SetStateAction<string>> | ((val: string) => void);
  priority: string;
  onPriorityChange: React.Dispatch<React.SetStateAction<string>> | ((val: string) => void);
  department: string;
  onDepartmentChange: React.Dispatch<React.SetStateAction<string>> | ((val: string) => void);
  scope?: "ALL" | "ASSIGNED_TO_ME";
  onScopeChange?: (scope: "ALL" | "ASSIGNED_TO_ME") => void;
  onReset: () => void;
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  searchValue,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  department,
  onDepartmentChange,
  scope = "ALL",
  onScopeChange,
  onReset,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-xs">
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        {/* Scope Triage Toggle: All Queue vs Assigned to Me */}
        {onScopeChange && (
          <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200 shrink-0">
            <button
              onClick={() => onScopeChange("ALL")}
              style={scope === "ALL" ? { backgroundColor: BUTTONS.primary } : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                scope === "ALL"
                  ? "text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Queue</span>
            </button>
            <button
              onClick={() => onScopeChange("ASSIGNED_TO_ME")}
              style={scope === "ASSIGNED_TO_ME" ? { backgroundColor: BUTTONS.primary } : undefined}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                scope === "ASSIGNED_TO_ME"
                  ? "text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-900" />
              <span>Assigned to Me</span>
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search title, ticket # (TICK-1024), or requester..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{ focusBorderColor: BUTTONS.primary } as any}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Dropdown Filters & Reset */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* Department Filter */}
          <select
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            <option value="IT Support">IT Support</option>
            <option value="Network">Network</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Infrastructure">Infrastructure</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        </div>

      </div>
    </div>
  );
};