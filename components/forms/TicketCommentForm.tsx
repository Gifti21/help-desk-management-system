"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { BUTTONS } from "@/lib/colors";

interface TicketCommentFormProps {
  ticketId: string;
  onAddComment: (ticketId: string, content: string) => void;
  isLoading?: boolean;
}

export const TicketCommentForm: React.FC<TicketCommentFormProps> = ({
  ticketId,
  onAddComment,
  isLoading = false,
}) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    onAddComment(ticketId, content.trim());
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Write internal resolution note or response to requester..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
          style={{ focusBorderColor: BUTTONS.primary } as any}
          className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none disabled:opacity-50 transition-colors"
        />
        <button
          type="submit"
          disabled={!content.trim() || isLoading}
          style={{ backgroundColor: BUTTONS.primary }}
          className="text-slate-900 font-extrabold px-4 py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 hover:opacity-95 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all cursor-pointer shadow-xs shrink-0"
        >
          <Send className="w-3.5 h-3.5 text-slate-900" />
          <span>Post Note</span>
        </button>
      </div>
    </form>
  );
};