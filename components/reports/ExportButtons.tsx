"use client";

import React from "react";
import { Download, FileText } from "lucide-react";
import { ActionButton } from "../admin/ActionButton";
import { BUTTONS, DARK_GREEN } from "@/lib/colors";
import { Ticket } from "@/types/ticket";
import { exportToCSV, exportToPDF } from "@/utils/exportUtils";

interface LegacyExportButtonsProps {
  onExportCSV: () => void;
  onExportPDF: () => void;
  isLoading?: boolean;
}

interface TicketExportButtonsProps {
  tickets: Ticket[];
  title?: string;
}

type ExportButtonsProps = LegacyExportButtonsProps | TicketExportButtonsProps;

export function ExportButtons(props: ExportButtonsProps) {
  if ("onExportCSV" in props && "onExportPDF" in props) {
    const { onExportCSV, onExportPDF, isLoading = false } = props;

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

  const { tickets, title } = props;

  return (
    <div className="flex items-center gap-2 sm:gap-3 print:hidden">
      <button
        onClick={() => exportToCSV(tickets)}
        style={{ color: DARK_GREEN, borderColor: DARK_GREEN }}
        className="inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors hover:bg-slate-50 sm:px-3.5 sm:py-2"
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
}
