"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTickets } from "@/context/TicketContext";
import { usePagination } from "@/hooks/usePagination";
import { TicketDrawer } from "@/components/dashboard/TicketDrawer";
import { CreateTicketModal } from "@/components/dashboard/CreateTicketModal";
import { TicketFilters } from "@/components/tickets/TicketFilters";
import { TicketTable } from "@/components/tickets/TicketTable";
import { ClientChart } from "@/components/dashboard/ClientChart";
import { Ticket, formatTicketData } from "@/types/ticket";
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
  FileSpreadsheet,
  ChevronLeft
} from "lucide-react";
import { FONT_FAMILY } from "@/lib/fonts";

export default function TechnicianDashboard() {
  const { 
    tickets: rawTickets = [], 
    updateTicketStatus, 
    updateTicketPriority, 
    addComment 
  } = useTickets();

  // Normalize tickets top-level so charts, filters, and tables use clean data
  const tickets = useMemo(() => {
    return rawTickets.map(formatTicketData);
  }, [rawTickets]);

  // Client-side mount flag to prevent hydration mismatches
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    () => tickets.filter((t) => {
      const s = (t.status || "").toUpperCase().replace(/_/g, " ");
      return s.includes("OPEN") || s.includes("IN PROGRESS") || s.includes("PENDING");
    }).length,
    [tickets]
  );
  
  const closedTickets = useMemo(
    () => tickets.filter((t) => {
      const s = (t.status || "").toUpperCase().replace(/_/g, " ");
      return s.includes("CLOSE") || s.includes("RESOLVE");
    }).length,
    [tickets]
  );
  
  const overdueTickets = useMemo(
    () => tickets.filter((t) => {
      const p = (t.priority || "").toUpperCase();
      const s = (t.status || "").toUpperCase().replace(/_/g, " ");
      return p === "CRITICAL" && !s.includes("RESOLVE") && !s.includes("CLOSE");
    }).length,
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
      "Human Resources": 0,
      "Finance": 0,
      "Operations": 0,
      "Legal & Compliance": 0,
    };

    tickets.forEach((t) => {
      const dept = (t.department || "IT Support").toString();
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    return Object.entries(deptMap).map(([dept, count]) => ({
      department: dept,
      count,
    }));
  }, [tickets]);

  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, idx) => {
      const count = tickets.filter((t) => {
        if (!t.createdAt) return false;
        const date = new Date(t.createdAt);
        return !isNaN(date.getTime()) && date.getMonth() === idx && date.getFullYear() === currentYear;
      }).length;

      return { month, count };
    });
  }, [tickets]);

  // ==========================================
  // 3. APEXCHARTS CONFIGURATIONS
  // ==========================================
  const monthlyAreaOptions: ApexCharts.ApexOptions = useMemo(() => ({
    chart: { type: "area", toolbar: { show: false }, fontFamily: "inherit" },
    colors: ["#0d9488"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2.5 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.01, stops: [0, 90, 100] }
    },
    xaxis: {
      categories: monthlyData.map(d => d.month),
      labels: { style: { colors: "#64748b", fontSize: "11px", fontWeight: 600 } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: { style: { colors: "#64748b", fontSize: "11px", fontWeight: 600 } },
      min: 0,
      forceNiceScale: true,
    },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4 },
    tooltip: { theme: "light" }
  }), [monthlyData]);

  const monthlyAreaSeries = useMemo(() => [{ name: "Tickets", data: monthlyData.map(d => d.count) }], [monthlyData]);

  const donutOptions: ApexCharts.ApexOptions = useMemo(() => ({
    chart: { type: "donut", fontFamily: "inherit" },
    labels: ["Open", "In Progress", "Resolved", "Closed"],
    colors: ["#0ea5e9", "#f59e0b", "#10b981", "#64748b"],
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            name: { show: true, fontSize: "11px", fontWeight: 600, color: "#64748b", offsetY: -6, formatter: () => "Total Tickets" },
            value: { show: true, fontSize: "20px", fontWeight: 800, color: "#0f172a", offsetY: 4, formatter: () => `${totalTickets}` },
            total: { show: true, label: "Total Tickets", formatter: () => `${totalTickets}` }
          }
        }
      }
    },
    tooltip: { theme: "light" }
  }), [totalTickets]);

  const donutSeries = useMemo(() => [
    statusCounts.OPEN,
    statusCounts.IN_PROGRESS,
    statusCounts.RESOLVED,
    statusCounts.CLOSED
  ], [statusCounts]);

  const departmentBarOptions: ApexCharts.ApexOptions = useMemo(() => ({
    chart: { type: "bar", toolbar: { show: false }, fontFamily: "inherit" },
    plotOptions: {
      bar: { 
        borderRadius: 5, 
        columnWidth: "40%",
        distributed: true
      }
    },
    colors: ["#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#6366f1", "#14b8a6"],
    dataLabels: {
      enabled: true,
      style: { fontSize: "11px", fontWeight: 700, colors: ["#0f172a"] },
      offsetY: -18,
    },
    legend: { show: false },
    xaxis: {
      categories: departmentData.map(d => d.department),
      labels: { style: { colors: "#64748b", fontSize: "11px", fontWeight: 600 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#0f172a", fontSize: "11px", fontWeight: 700 } },
      min: 0,
      forceNiceScale: true,
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    tooltip: { theme: "light" }
  }), [departmentData]);

  const departmentBarSeries = useMemo(() => [{ name: "Tickets", data: departmentData.map(d => d.count) }], [departmentData]);

  // ==========================================
  // 4. QUEUE FILTERING & PAGINATION (5 per page)
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
        (t.department || "").toString().toLowerCase().includes(departmentFilter.toLowerCase());

      return matchesScope && matchesSearch && matchesStatus && matchesPriority && matchesDept;
    });
  }, [tickets, scopeFilter, searchQuery, statusFilter, priorityFilter, departmentFilter]);

  const pagination = usePagination({ 
    totalItems: filteredWorkload.length, 
    pageSize: 5 
  });

  const visibleWorkload = useMemo(
    () => pagination.paginate(filteredWorkload),
    [filteredWorkload, pagination]
  );

  const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);

  const selectedTicket = useMemo(
    () => tickets.find((t) => t.id === selectedTicketId) || null,
    [tickets, selectedTicketId]
  );

  return (
    <div 
      className="p-5 sm:p-8 max-w-7xl mx-auto space-y-8 bg-[#F8FAFC] min-h-screen"
      style={{ fontFamily: FONT_FAMILY.primary }}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Welcome back, Bontu</span>
              <span className="text-xl">👋</span>
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Support Agent &bull; IT Staff
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            System-wide Support Agent operational dashboard, department triage queue, and audit analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="shadow-xs font-semibold"
          >
            <PlusCircle className="w-4 h-4 mr-1" /> Log Ticket
          </Button>
          <Link
            href="/dashboard/technician/reports"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3.5 py-2 rounded-lg shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Reports
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="bg-white border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">Total Tickets</p>
              <h2 className="text-3xl font-black text-slate-900">{totalTickets}</h2>
            </div>
            <div className="p-3 rounded-xl bg-slate-100/80 border border-slate-200/60 text-slate-700">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">Open Tickets</p>
              <h2 className="text-3xl font-black text-amber-600">{openTickets}</h2>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">Closed Tickets</p>
              <h2 className="text-3xl font-black text-emerald-600">{closedTickets}</h2>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="bg-white border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest">Critical SLA / Overdue</p>
              <h2 className="text-3xl font-black text-rose-600">{overdueTickets}</h2>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Analytics Layout */}
      {isMounted && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Annual Tickets Breakdown ({new Date().getFullYear()})
                </h2>
              </div>
            </div>
            <div className="w-full">
              <ClientChart options={monthlyAreaOptions} series={monthlyAreaSeries} type="area" height={240} />
            </div>
          </Card>

          <Card className="bg-white border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-600" />
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Status Distribution
                </h2>
              </div>
            </div>
            <div className="w-full flex justify-center items-center py-2">
              <ClientChart options={donutOptions} series={donutSeries} type="donut" height={230} width="100%" />
            </div>
          </Card>
        </div>
      )}

      {/* Department Allocation Chart */}
      {isMounted && (
        <Card className="bg-white border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
                Department Workload Allocations
              </h2>
            </div>
          </div>
          <div className="w-full">
            <ClientChart options={departmentBarOptions} series={departmentBarSeries} type="bar" height={230} />
          </div>
        </Card>
      )}

      {/* Queue Filters & Active Queue Table Section */}
      <div className="space-y-4">
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

        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="p-6 pb-4 flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
              Active Ticket Queue ({filteredWorkload.length})
            </h2>
            <Link
              href="/dashboard/technician/queue"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
            >
              Full Queue Page <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <TicketTable
            tickets={visibleWorkload}
            onSelectTicket={(ticket: Ticket) => setSelectedTicketId(ticket.id)}
          />

          {/* Minimalist Professional Dot Pagination Footer */}
          {pagination.totalPages > 1 ? (
            <div className="flex items-center justify-center px-6 py-4 bg-white border-t border-slate-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={pagination.previousPage}
                  disabled={!pagination.hasPrevious}
                  className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                    pagination.hasPrevious
                      ? 'text-slate-700 hover:bg-slate-100 cursor-pointer'
                      : 'text-slate-300 cursor-not-allowed'
                  }`}
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  {pages.map((p) => {
                    const isActive = p === pagination.currentPage;
                    return (
                      <button
                        key={p}
                        onClick={() => pagination.setPage(p)}
                        aria-label={`Page ${p}`}
                        className={`transition-all rounded-full ${
                          isActive
                            ? 'w-6 h-2.5 bg-[#2FD9C4]'
                            : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400 cursor-pointer'
                        }`}
                      />
                    );
                  })}
                </div>

                <button
                  onClick={pagination.nextPage}
                  disabled={!pagination.hasNext}
                  className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                    pagination.hasNext
                      ? 'text-slate-700 hover:bg-slate-100 cursor-pointer'
                      : 'text-slate-300 cursor-not-allowed'
                  }`}
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Drawers & Modals */}
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

      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}