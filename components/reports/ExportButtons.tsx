"use client";

import React from "react";
import { Download, FileText } from "lucide-react";
import { Ticket } from "@/types/ticket";
import { exportToCSV, exportToPDF } from "@/utils/exportUtils";

interface ExportButtonsProps {
  tickets: Ticket[];
  title?: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ tickets, title }) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 print:hidden">
      <button
        onClick={() => exportToCSV(tickets)}
        className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors"
        title="Download CSV spreadsheet"
      >
        <Download className="w-3.5 h-3.5 text-slate-500" /> Export CSV
      </button>

      <button
        onClick={() => exportToPDF(tickets, title)}
        className="inline-flex items-center gap-1.5 bg-[#0E2621] text-white hover:bg-[#163831] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-bold shadow-sm transition-colors"
        title="Generate formatted PDF document"
      >
        <FileText className="w-3.5 h-3.5 text-[#2FD9C4]" /> Export PDF
      </button>
    </div>
  );
};