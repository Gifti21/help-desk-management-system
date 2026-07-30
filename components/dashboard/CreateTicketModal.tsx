"use client";

import React, { useState } from "react";
import { X, PlusCircle } from "lucide-react";
import { Priority } from "@/types/ticket";
import { useTickets } from "@/context/TicketContext";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (ticketData: any) => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({ isOpen, onClose, onCreate }) => {
  const { addTicket } = useTickets();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  
  // Explicitly separate Category (issue type/technical nature) from Department (owning team/responsibility)
  const [category, setCategory] = useState("Software Issue");
  const [department, setDepartment] = useState("IT Support");
  
  const [creatorName, setCreatorName] = useState("");
  const [creatorEmail, setCreatorEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    addTicket({
      title,
      description,
      priority,
      category,
      department,
      creatorName: creatorName || "Employee",
      creatorEmail: creatorEmail || "user@besys.tech",
      status: "OPEN",
    });

    if (onCreate) {
      onCreate({ title, description, priority, category, department, creatorName, creatorEmail });
    }

    setTitle("");
    setDescription("");
    setCreatorName("");
    setCreatorEmail("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-700" />
            <h3 className="text-base font-bold text-slate-900">Log Ticket on Behalf of Employee</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 rounded-lg p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Requester Full Name</label>
              <input
                type="text"
                required
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="e.g. Abebe Tesfaye"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#0E2621]"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Requester Email</label>
              <input
                type="email"
                required
                value={creatorEmail}
                onChange={(e) => setCreatorEmail(e.target.value)}
                placeholder="abebe@besys.tech"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#0E2621]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Ticket Subject / Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. VPN connection dropping repeatedly"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#0E2621]"
            />
          </div>

          {/* SRS Split: Category (Issue Type) and Department (Owning Team) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Category (Issue Type)</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#0E2621]"
              >
                <option value="Software Issue">Software Issue</option>
                <option value="Hardware Failure">Hardware Failure</option>
                <option value="Network / Connectivity">Network / Connectivity</option>
                <option value="Access & Credentials">Access & Credentials</option>
                <option value="Billing & Finance">Billing & Finance</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Department Allocation</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#0E2621]"
              >
                <option value="IT Support">IT Support</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Legal & Compliance">Legal & Compliance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Priority Level</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#0E2621]"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Issue Details & Steps</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed explanation of the technical problem..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#0E2621]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#0E2621] text-white font-bold hover:bg-[#163831] shadow-xs transition-colors"
            >
              Log Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};