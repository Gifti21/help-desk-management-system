"use client";

import React from "react";
import { Comment } from "@/types/ticket";
import { MessageSquare, UserCheck, ShieldAlert, User } from "lucide-react";

interface CommentThreadProps {
  comments: Comment[];
}

export const CommentThread: React.FC<CommentThreadProps> = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return (
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2">
        <MessageSquare className="w-6 h-6 text-slate-400 mx-auto" />
        <p className="text-xs text-slate-500 italic">No communication thread or internal notes yet.</p>
      </div>
    );
  }

  const getRoleBadge = (role: Comment["authorRole"]) => {
    switch (role) {
      case "AGENT":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
            <UserCheck className="w-2.5 h-2.5 text-emerald-700" /> SUPPORT AGENT
          </span>
        );
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-100 text-purple-900 border border-purple-300">
            <ShieldAlert className="w-2.5 h-2.5 text-purple-700" /> ADMIN
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <User className="w-2.5 h-2.5 text-slate-500" /> EMPLOYEE
          </span>
        );
    }
  };

  return (
    <div className="space-y-3 w-full">
      <h3 className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-bold">
        Chronological Communication History ({comments.length})
      </h3>
      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={`p-3 rounded-xl border space-y-1.5 shadow-xs ${
              comment.authorRole === "AGENT"
                ? "bg-emerald-50/70 border-emerald-200 ml-2"
                : "bg-white border-slate-200 mr-2"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-xs text-slate-900">{comment.authorName}</span>
                {getRoleBadge(comment.authorRole)}
              </div>
              <span className="text-[10px] font-mono text-slate-400 shrink-0">
                {new Date(comment.timestamp).toLocaleString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};