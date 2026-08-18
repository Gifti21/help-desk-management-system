<<<<<<< HEAD
'use client';

import React from 'react';
import { ActionButton } from '../admin/ActionButton';
import { Download, FileText } from 'lucide-react';

interface ExportButtonsProps {
    onExportCSV: () => void;
    onExportPDF: () => void;
    isLoading?: boolean;
}

export function ExportButtons({ onExportCSV, onExportPDF, isLoading = false }: ExportButtonsProps) {
    return (
        <div className="flex items-center space-x-2">
            <ActionButton
                variant="outline"
                size="sm"
                icon={Download}
                onClick={onExportCSV}
                disabled={isLoading}
            >
                Export CSV
            </ActionButton>
            <ActionButton
                variant="primary"
                size="sm"
                icon={FileText}
                onClick={onExportPDF}
                disabled={isLoading}
            >
                Export PDF
            </ActionButton>
        </div>
    );
}
=======
"use client";

import React from "react";
import { Download, FileText } from "lucide-react";
import { Ticket } from "@/types/ticket";
import { exportToCSV, exportToPDF } from "@/utils/exportUtils";
import { BUTTONS } from "@/lib/colors";

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
        style={{ backgroundColor: BUTTONS.primary }}
        className="inline-flex items-center gap-1.5 text-slate-900 hover:opacity-90 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg text-xs font-extrabold shadow-sm transition-opacity"
        title="Generate formatted PDF document"
      >
        <FileText className="w-3.5 h-3.5 text-slate-900" /> Export PDF
      </button>
    </div>
  );
};
>>>>>>> origin/master
