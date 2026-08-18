"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { useTickets } from "@/context/TicketContext";
import { ExportButtons } from "@/components/reports/ExportButtons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Calendar, FileSpreadsheet, ShieldCheck } from "lucide-react";

export default function AgentReportsPage() {
  const { tickets } = useTickets();
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Filter tickets by selected month for Monthly Reports
  const filteredMonthlyTickets = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return tickets.filter((t) => {
      if (!t.createdAt) return false;
      const date = new Date(t.createdAt);
      return date.getMonth() === selectedMonth && date.getFullYear() === currentYear;
    });
  }, [tickets, selectedMonth]);

  // Calculations for monthly summary
  const monthlyMetrics = useMemo(() => {
    const total = filteredMonthlyTickets.length;
    const resolved = filteredMonthlyTickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length;
    const open = filteredMonthlyTickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS" || t.status === "PENDING").length;
    const critical = filteredMonthlyTickets.filter((t) => t.priority === "CRITICAL").length;

    return { total, resolved, open, critical };
  }, [filteredMonthlyTickets]);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-[#F4F7F6] min-h-screen">
      
      {/* Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Agent Workload & Audit Reports</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Support Agent Bontu
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Review monthly resolution logs, audit ticket metrics, and export official CSV & formatted PDF activity reports.
          </p>
        </div>

        {/* Export CSV & Dynamic PDF Buttons */}
        <ExportButtons 
          tickets={filteredMonthlyTickets.length > 0 ? filteredMonthlyTickets : tickets} 
          title={`Besys HDMS Workload Report - ${months[selectedMonth]} ${new Date().getFullYear()}`}
        />
      </div>

      {/* Monthly Report Controls */}
      <Card className="bg-white border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Monthly Operational Performance Summary
            </h2>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <label className="text-xs text-slate-600 font-semibold">Select Month:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold rounded-lg p-2 focus:outline-none focus:border-[#0E2621]"
            >
              {months.map((month, idx) => (
                <option key={month} value={idx}>{month} {new Date().getFullYear()}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Metric Cards for Selected Month */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Monthly Total</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{monthlyMetrics.total}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Resolved / Closed</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">{monthlyMetrics.resolved}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Active Queue</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-0.5">{monthlyMetrics.open}</p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <p className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider">Critical SLA Tickets</p>
            <p className="text-2xl font-extrabold text-rose-600 mt-0.5">{monthlyMetrics.critical}</p>
          </div>
        </div>
      </Card>

      {/* Monthly Detailed Log Table */}
      <Card className="bg-white border-slate-200 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Ticket Log Audit Details ({months[selectedMonth]})
          </h3>
        </div>

        {filteredMonthlyTickets.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center bg-slate-50 rounded-xl border border-slate-200">
            No ticket records found for {months[selectedMonth]}. All system tickets are available via the Export buttons above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-mono uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Subject / Title</th>
                  <th className="p-3">Requester</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMonthlyTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-[#0E2621] font-bold">{t.ticketNumber || t.id}</td>
                    <td className="p-3 font-bold text-slate-900">{t.title}</td>
                    <td className="p-3 text-slate-600">{t.creatorName || "Employee"}</td>
                    <td className="p-3 text-slate-600">{(t.category || t.department || "IT Support").toString()}</td>
                    <td className="p-3"><StatusBadge type="priority" value={t.priority} /></td>
                    <td className="p-3"><StatusBadge type="status" value={t.status} /></td>
                    <td className="p-3 font-mono text-slate-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </div>
  );
}