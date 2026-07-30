"use client";

import React, { useState } from "react";
import { Ticket, Status, Priority } from "@/types/ticket";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TicketStatusForm } from "@/components/forms/TicketStatusForm";
import { TicketPriorityForm } from "@/components/forms/TicketPriorityForm";
import { TicketCommentForm } from "@/components/forms/TicketCommentForm";
import { CommentThread } from "@/components/dashboard/CommentThread";
import { X, User, Tag, History, FileText, RotateCcw } from "lucide-react";
import { useTickets } from "@/context/TicketContext";

interface TicketDrawerProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Status) => void;
  onUpdatePriority: (id: string, priority: Priority) => void;
  onAddComment: (id: string, content: string) => void;
  isLoading?: boolean;
}

export const TicketDrawer: React.FC<TicketDrawerProps> = ({
  ticket,
  isOpen,
  onClose,
  onUpdateStatus,
  onUpdatePriority,
  onAddComment,
  isLoading = false,
}) => {
  const [activeTab, setActiveTab] = useState<"details" | "history">("details");
  const { reopenTicket } = useTickets();

  if (!isOpen || !ticket) return null;

  const isClosedOrResolved = ticket.status === "CLOSED" || ticket.status === "RESOLVED";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      {/* Sliding Panel - Light Theme */}
      <div className="w-full max-w-xl bg-white border-l border-slate-200 h-full flex flex-col justify-between shadow-2xl transition-all">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-[#0E2621] bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                {ticket.ticketNumber || ticket.id}
              </span>
              <StatusBadge type="status" value={ticket.status} />
              <StatusBadge type="priority" value={ticket.priority} />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight line-clamp-2">
              {ticket.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white text-slate-400 hover:text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-5 text-xs font-mono">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-2.5 px-3 border-b-2 font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === "details"
                ? "border-[#0E2621] text-[#0E2621]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resolution & Details</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`py-2.5 px-3 border-b-2 font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === "history"
                ? "border-[#0E2621] text-[#0E2621]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit History ({ticket.history?.length || 0})</span>
          </button>
        </div>

        {/* Drawer Body Area */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 text-xs bg-slate-50/50">
          {activeTab === "details" ? (
            <>
              {/* Reporter Information Header */}
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                  Reporter & Department Context
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="font-semibold text-slate-900">{ticket.creatorName || "Employee"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 font-mono text-[11px]">
                    <Tag className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Category: {(ticket.category || ticket.department || "IT Support").toString()}</span>
                  </div>
                </div>
              </div>

              {/* Re-open Banner if ticket is Closed or Resolved */}
              {isClosedOrResolved && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-amber-900">Ticket is currently {ticket.status}</p>
                    <p className="text-[11px] text-amber-700">Need to perform further triage? You can re-open this ticket.</p>
                  </div>
                  <button
                    onClick={() => reopenTicket(ticket.id)}
                    className="inline-flex items-center gap-1.5 bg-[#0E2621] text-white hover:bg-[#163831] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-[#2FD9C4]" /> Re-open Ticket
                  </button>
                </div>
              )}

              {/* Form Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TicketStatusForm
                  ticketId={ticket.id}
                  currentStatus={ticket.status}
                  onUpdateStatus={onUpdateStatus}
                  isLoading={isLoading}
                />
                <TicketPriorityForm
                  ticketId={ticket.id}
                  currentPriority={ticket.priority}
                  onUpdatePriority={onUpdatePriority}
                  isLoading={isLoading}
                />
              </div>

              {/* Ticket Description */}
              <div className="space-y-1.5">
                <h3 className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                  Description
                </h3>
                <p className="p-3 bg-white border border-slate-200 rounded-xl text-slate-800 leading-relaxed whitespace-pre-wrap shadow-xs">
                  {ticket.description}
                </p>
              </div>

              {/* Chronological Comment Thread */}
              <CommentThread comments={ticket.comments} />
            </>
          ) : (
            /* Audit Trail Tab */
            <div className="space-y-3">
              <h3 className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                Ticket Activity Timeline
              </h3>
              {!ticket.history || ticket.history.length === 0 ? (
                <p className="text-slate-400 italic text-center py-6">
                  No historical activity logged for this ticket yet.
                </p>
              ) : (
                <div className="relative border-l border-slate-200 ml-3 space-y-4 pl-4 py-1">
                  {ticket.history.map((entry) => (
                    <div key={entry.id} className="relative space-y-0.5">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                      <div className="text-xs text-slate-900 font-bold">{entry.title || entry.description}</div>
                      <p className="text-xs text-slate-600">{entry.description}</p>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-1">
                        <span>Actor: {entry.actor || "System"}</span>
                        <span>•</span>
                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comment Input Form */}
        {activeTab === "details" && (
          <div className="p-4 bg-white border-t border-slate-200">
            <TicketCommentForm
              ticketId={ticket.id}
              onAddComment={onAddComment}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};