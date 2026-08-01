"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useTickets } from "@/context/TicketContext";
import { TicketDrawer } from "@/components/dashboard/TicketDrawer";
import { CreateTicketModal } from "@/components/dashboard/CreateTicketModal";
import { TicketFilters } from "@/components/tickets/TicketFilters";
import { TicketTable } from "@/components/tickets/TicketTable";
import { ClientChart } from "@/components/dashboard/ClientChart";
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
import { FONT_FAMILY } from "@/lib/fonts";

export default function TechnicianDashboard() {
  const { 
    tickets = [], 
    updateTicketStatus, 
    updateTicketPriority, 
    addComment 
  } = useTickets();

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
  // 1. METRICS & SUMMARY COMPUTATION (ROBUST)
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
    colors: ["#2FD9C4"],
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.02, stops: [0, 90, 100] }
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
          size: "70%",
          labels: {
            show: true,
            name: { show: true, fontSize: "12px", fontWeight: 600, color: "#64748b", offsetY: -8, formatter: () => "Total Tickets" },
            value: { show: true, fontSize: "22px", fontWeight: 800, color: "#0E2621", offsetY: 4, formatter: () => `${totalTickets}` },
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
      bar: { horizontal: true, borderRadius: 6, barHeight: "50%" }
    },
    colors: ["#10b981"],
    dataLabels: {
      enabled: true,
      style: { fontSize: "11px", fontWeight: 700, colors: ["#0E2621"] },
      offsetX: 10,
    },
    xaxis: {
      categories: departmentData.map(d => d.department),
      labels: { style: { colors: "#64748b", fontSize: "11px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
      min: 0,
      forceNiceScale: true,
    },
    yaxis: {
      labels: { style: { colors: "#0E2621", fontSize: "11px", fontWeight: 700 } }
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } }
    },
    tooltip: { theme: "light" }
  }), [departmentData]);

  const departmentBarSeries = useMemo(() => [{ name: "Tickets", data: departmentData.map(d => d.count) }], [departmentData]);

  // ==========================================
  // 4. QUEUE FILTERING
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
    <div 
      className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 bg-[#F4F7F6] min-h-screen"
      style={{ fontFamily: FONT_FAMILY.primary }}
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Welcome back, Bontu</span>
              <span className="text-xl">👋</span>
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
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusCircle className="w-4 h-4" /> + Log Ticket
          </Button>
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
        </Card>
      </div>

      {/* Analytics Charts */}
      {isMounted && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Annual Tickets Breakdown ({new Date().getFullYear()})
                </h2>
              </div>
            </div>
            <div className="w-full">
              <ClientChart options={monthlyAreaOptions} series={monthlyAreaSeries} type="area" height={220} />
            </div>
          </Card>

          <Card className="bg-white border-slate-200 p-5 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-700" />
                <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Status Distribution
                </h2>
              </div>
            </div>
            <div className="w-full flex justify-center items-center">
              <ClientChart options={donutOptions} series={donutSeries} type="donut" height={210} width="100%" />
            </div>
          </Card>
        </div>
      )}

      {isMounted && (
        <Card className="bg-white border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Department Workload Allocations
              </h2>
            </div>
          </div>
          <div className="w-full">
            <ClientChart options={departmentBarOptions} series={departmentBarSeries} type="bar" height={220} />
          </div>
        </Card>
      )}

      {/* Queue Filters */}
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

      {/* Ticket Table */}
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

      {/* Ticket Drawer */}
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

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}