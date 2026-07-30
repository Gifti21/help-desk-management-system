"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { useTickets } from "@/context/TicketContext";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TicketDrawer } from "@/components/dashboard/TicketDrawer";
import { CreateTicketModal } from "@/components/dashboard/CreateTicketModal";
import { TicketFilters } from "@/components/tickets/TicketFilters";
import { TicketTable } from "@/components/tickets/TicketTable";
import { Ticket } from "@/types/ticket";
import { 
  Inbox, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  PieChart, 
  BarChart3,
  ChevronRight,
  ShieldCheck,
  PlusCircle,
  FileSpreadsheet
} from "lucide-react";

export default function TechnicianDashboard() {
  const { 
    tickets, 
    updateTicketStatus, 
    updateTicketPriority, 
    addComment 
  } = useTickets();

  // Triage and interaction states
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [scopeFilter, setScopeFilter] = useState<"ALL" | "ASSIGNED_TO_ME">("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // ==========================================
  // 1. METRICS & SUMMARY COMPUTATION
  // ==========================================
  const totalTickets = tickets.length;
  const openTickets = useMemo(
    () => tickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS" || t.status === "PENDING").length,
    [tickets]
  );
  const closedTickets = useMemo(
    () => tickets.filter((t) => t.status === "CLOSED" || t.status === "RESOLVED").length,
    [tickets]
  );
  const overdueTickets = useMemo(
    () => tickets.filter((t) => t.priority === "CRITICAL" && t.status !== "RESOLVED" && t.status !== "CLOSED").length,
    [tickets]
  );

  // ==========================================
  // 2. CHARTS DATA COMPUTATION
  // ==========================================
  const statusCounts = useMemo(() => {
    return {
      OPEN: tickets.filter((t) => t.status === "OPEN").length,
      IN_PROGRESS: tickets.filter((t) => t.status === "IN_PROGRESS").length,
      RESOLVED: tickets.filter((t) => t.status === "RESOLVED").length,
      CLOSED: tickets.filter((t) => t.status === "CLOSED").length,
    };
  }, [tickets]);

  const departmentData = useMemo(() => {
    const deptMap: Record<string, number> = {
      "IT Support": 0,
      "Network": 0,
      "Hardware": 0,
      "Software": 0,
      "Infrastructure": 0,
    };

    tickets.forEach((t) => {
      const dept = (t.category || t.department || "IT Support").toString();
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    return Object.entries(deptMap).map(([dept, count]) => ({
      department: dept,
      count,
      percentage: totalTickets ? Math.round((count / totalTickets) * 100) : 0,
    }));
  }, [tickets, totalTickets]);

  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, idx) => {
      const count = tickets.filter((t) => {
        if (!t.createdAt) return false;
        const date = new Date(t.createdAt);
        return date.getMonth() === idx && date.getFullYear() === currentYear;
      }).length;

      return { month, count };
    });
  }, [tickets]);

  const maxMonthlyCount = useMemo(() => {
    const max = Math.max(...monthlyData.map((d) => d.count), 1);
    return max;
  }, [monthlyData]);

  // ==========================================
  // 3. QUEUE FILTERING (Scope, Search, Status, Dept, Priority)
  // ==========================================
  const filteredWorkload = useMemo(() => {
    return tickets.filter((t) => {
      const matchesScope = scopeFilter === "ALL" || t.assigneeId === "agent_bontu";
      const matchesSearch =
        searchQuery === "" ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.creatorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
      const matchesPriority = priorityFilter === "ALL" || t.priority === priorityFilter;
      const matchesDept =
        departmentFilter === "ALL" ||
        (t.category || t.department || "").toString().toLowerCase().includes(departmentFilter.toLowerCase());

      return matchesScope && matchesSearch && matchesStatus && matchesPriority && matchesDept;
    });
  }, [tickets, scopeFilter, searchQuery, statusFilter, priorityFilter, departmentFilter]);

  const selectedTicket = useMemo(
    () => tickets.find((t) => t.id === selectedTicketId) || null,
    [tickets, selectedTicketId]
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-[#F4F7F6] min-h-screen">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {(() => {
                const hour = new Date().getHours();
                if (hour < 12) return "Good afternoon, Bontu";
                if (hour < 18) return "Good morning, Bontu";
                return "Welcome back, Bontu";
              })()} 👋
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Support Agent &bull; IT Staff
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            System-wide Support Agent operational dashboard, department triage queue, and audit analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 text-xs font-bold bg-[#0E2621] text-white hover:bg-[#163831] px-4 py-2 rounded-lg transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-[#2FD9C4]" /> + Log Ticket
          </button>
          <Link
            href="/dashboard/technician/reports"
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-lg shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" /> Reports
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Total Tickets</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalTickets}</h2>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-[#0E2621]">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>System Records</span>
            <span className="text-emerald-700 font-bold">Total</span>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Open Tickets</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">{openTickets}</h2>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>Pending & In Progress</span>
            <span className="text-amber-600 font-bold">{openTickets} Active</span>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Closed Tickets</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">{closedTickets}</h2>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>Resolved & Completed</span>
            <span className="text-emerald-700 font-bold">Closed</span>
          </div>
        </Card>

        <Card className="bg-white border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Critical SLA / Overdue</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-1">{overdueTickets}</h2>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>Critical Priority Active</span>
            <span className="text-rose-600 font-bold">Action Required</span>
          </div>
        </Card>
      </div>

      {/* Analytics & Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets by Month Chart */}
        <Card className="lg:col-span-2 bg-white border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Annual Tickets Breakdown ({new Date().getFullYear()})
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Monthly Trend
            </span>
          </div>

          <div className="h-48 w-full flex items-end justify-between gap-1 sm:gap-2 pt-6 pb-2 px-1 border-b border-slate-200">
            {monthlyData.map((d) => {
              const barHeightPercent = maxMonthlyCount > 0 ? (d.count / maxMonthlyCount) * 100 : 0;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <span className="text-[9px] font-mono font-bold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {d.count}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t min-h-[6px] relative overflow-hidden flex items-end">
                    <div
                      className="w-full bg-[#0E2621] rounded-t transition-all duration-300 group-hover:bg-emerald-600"
                      style={{ height: `${barHeightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-slate-600 mt-2">{d.month}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Tickets by Status Breakdown */}
        <Card className="bg-white border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-700" />
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Status Distribution
              </h2>
            </div>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => setStatusFilter(statusFilter === "OPEN" ? "ALL" : "OPEN")}
              className={`cursor-pointer p-2.5 rounded-lg border transition-colors ${
                statusFilter === "OPEN" ? "bg-sky-50 border-sky-300" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span className="text-sky-700">Open</span>
                <span className="text-slate-800 font-mono">{statusCounts.OPEN}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-500 rounded-full"
                  style={{ width: `${totalTickets ? (statusCounts.OPEN / totalTickets) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div
              onClick={() => setStatusFilter(statusFilter === "IN_PROGRESS" ? "ALL" : "IN_PROGRESS")}
              className={`cursor-pointer p-2.5 rounded-lg border transition-colors ${
                statusFilter === "IN_PROGRESS" ? "bg-amber-50 border-amber-300" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span className="text-amber-700">In Progress</span>
                <span className="text-slate-800 font-mono">{statusCounts.IN_PROGRESS}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${totalTickets ? (statusCounts.IN_PROGRESS / totalTickets) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div
              onClick={() => setStatusFilter(statusFilter === "RESOLVED" ? "ALL" : "RESOLVED")}
              className={`cursor-pointer p-2.5 rounded-lg border transition-colors ${
                statusFilter === "RESOLVED" ? "bg-emerald-50 border-emerald-300" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span className="text-emerald-700">Resolved</span>
                <span className="text-slate-800 font-mono">{statusCounts.RESOLVED}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${totalTickets ? (statusCounts.RESOLVED / totalTickets) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div
              onClick={() => setStatusFilter(statusFilter === "CLOSED" ? "ALL" : "CLOSED")}
              className={`cursor-pointer p-2.5 rounded-lg border transition-colors ${
                statusFilter === "CLOSED" ? "bg-slate-200 border-slate-400" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className="flex justify-between text-xs mb-1 font-bold">
                <span className="text-slate-700">Closed</span>
                <span className="text-slate-800 font-mono">{statusCounts.CLOSED}</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-600 rounded-full"
                  style={{ width: `${totalTickets ? (statusCounts.CLOSED / totalTickets) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tickets by Department Grid */}
      <Card className="bg-white border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-700" />
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Department Workload Allocations
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Corporate System Scope</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {departmentData.map((dept) => (
            <div 
              key={dept.department}
              onClick={() => setDepartmentFilter(departmentFilter === dept.department ? "ALL" : dept.department)}
              className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                departmentFilter === dept.department
                  ? "bg-emerald-50 border-emerald-400 shadow-xs"
                  : "bg-slate-50 border-slate-200 hover:bg-slate-100"
              }`}
            >
              <p className="text-xs font-bold text-slate-900 truncate">{dept.department}</p>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-lg font-extrabold text-slate-900">{dept.count}</span>
                <span className="text-[10px] font-mono font-bold text-emerald-700">{dept.percentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${dept.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Queue Triage Toolbar */}
      <TicketFilters
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        priority={priorityFilter}
        onPriorityChange={setPriorityFilter}
        department={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        scope={scopeFilter}
        onScopeChange={setScopeFilter}
        onReset={() => {
          setStatusFilter("ALL");
          setPriorityFilter("ALL");
          setDepartmentFilter("ALL");
          setScopeFilter("ALL");
          setSearchQuery("");
        }}
      />

      {/* Ticket Table Queue */}
      <Card className="bg-white border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Active Ticket Queue ({filteredWorkload.length})
          </h2>
          <Link
            href="/dashboard/technician/queue"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
          >
            Full Queue Page <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <TicketTable
          tickets={filteredWorkload}
          onSelectTicket={(ticket: Ticket) => setSelectedTicketId(ticket.id)}
        />
      </Card>

      {/* Detail Inspection Drawer */}
      {selectedTicket && (
        <TicketDrawer
          ticket={selectedTicket}
          isOpen={!!selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
          onUpdateStatus={(id, status) => updateTicketStatus(id, status)}
          onUpdatePriority={(id, priority) => updateTicketPriority(id, priority)}
          onAddComment={(id, content) => {
            addComment(id, content, "Bontu");
          }}
        />
      )}

      {/* Log Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

    </div>
  );
}