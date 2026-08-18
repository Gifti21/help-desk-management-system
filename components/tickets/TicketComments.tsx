"use client";

import React, { useState } from "react";
import { MessageSquare, Send } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
}

interface TicketCommentsProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
}

export const TicketComments: React.FC<TicketCommentsProps> = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment("");
  };

  return (
    <div className="space-y-4 pt-4 border-t border-[#1E3E35]">
      <div className="flex items-center gap-2 text-white font-medium text-sm">
        <MessageSquare className="w-4 h-4 text-[#2FD9C4]" />
        <h3>Activity & Comments</h3>
      </div>

      {/* Chronological Comment List (FR-017) */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-[#060D0B] border border-[#1E3E35] rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#2FD9C4]">{comment.authorName}</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-slate-300 whitespace-pre-wrap">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-500 italic">No comments logged yet.</p>
        )}
      </div>

      {/* Add Comment Form (FR-016) */}
      <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
        <input
          type="text"
          placeholder="Type an internal update or reply..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 bg-[#060D0B] border border-[#1E3E35] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2FD9C4] transition-colors"
        />
        <button
          type="submit"
          className="px-3 py-2 bg-[#16332B] hover:bg-[#1E3E35] border border-[#1E3E35] text-[#2FD9C4] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};