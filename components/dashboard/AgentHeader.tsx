"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ChevronRight, RefreshCw } from "lucide-react";

interface AgentHeaderProps {
  agentName?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({
  agentName = "Support Agent",
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Support Agent Dashboard
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <ShieldCheck className="w-3 h-3" /> {agentName}
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Manage assigned tickets, perform status updates, add resolution notes, and close completed requests.
        </p>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
            title="Refresh queue"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-emerald-700" : ""}`} />
          </button>
        )}
        <Link
          href="/dashboard/technician/queue"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline bg-white px-3 py-2 rounded-lg border border-slate-200 transition-colors shadow-sm"
        >
          <span>Full Queue</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};