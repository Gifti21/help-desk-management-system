"use client";

import React, { useState, useEffect } from "react";
import { PageLayout } from "../../components/admin/PageLayout";
import { TopBar } from "../../components/admin/TopBar";
import { StatCard } from "../../components/admin/StatCard";
import { ActionButton } from "../../components/admin/ActionButton";
import { DataTable } from "../../components/admin/DataTable";
import { SearchFilter } from "../../components/admin/SearchFilter";
import { Card } from "../../components/ui/card";
import { useTheme } from "../../components/providers/ThemeProvider";
import { useToast } from "../../components/ui/toast";
import { fonts } from "@/lib/fonts";
import { PieChart } from "../../components/charts/PieChart";
import { BarChart } from "../../components/charts/BarChart";
import { LineChart } from "../../components/charts/LineChart";
import {
  Ticket,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { getDashboardData, type DashboardData } from "@/lib/api/dashboard";

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { colors: theme } = useTheme();
  const { toast } = useToast();

  // Data states
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast('Failed to load dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to page 1 when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Show loading state
  if (isLoading || !dashboardData) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: theme.primary }} />
        </div>
      </PageLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    // Match database enum: OPEN, IN_PROGRESS, RESOLVED, CLOSED
    const statusColors: Record<
      string,
      { bg: string; text: string; label: string }
    > = {
      OPEN: { bg: "#dbeafe", text: "#1e40af", label: "Open" },
      IN_PROGRESS: { bg: "#fef3c7", text: "#92400e", label: "In Progress" },
      RESOLVED: { bg: "#dcfce7", text: "#15803d", label: "Resolved" },
      CLOSED: { bg: "#f3f4f6", text: "#374151", label: "Closed" },
    };
    const colors_status = statusColors[status] || statusColors["OPEN"];

    return (
      <span
        className="px-2 py-1 text-xs font-medium rounded border"
        style={{
          backgroundColor: colors_status.bg,
          color: colors_status.text,
          fontSize: fonts.caption.small.size,
        }}
      >
        {colors_status.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    // Match database enum: LOW, MEDIUM, HIGH, CRITICAL
    const priorityColors: Record<
      string,
      { bg: string; text: string; label: string }
    > = {
      LOW: { bg: "#dcfce7", text: "#15803d", label: "Low" },
      MEDIUM: { bg: "#dbeafe", text: "#1e40af", label: "Medium" },
      HIGH: { bg: "#fed7aa", text: "#ea580c", label: "High" },
      CRITICAL: { bg: "#fee2e2", text: "#dc2626", label: "Critical" },
    };
    const colors_priority =
      priorityColors[priority] || priorityColors["MEDIUM"];

    return (
      <span
        className="px-2 py-1 text-xs font-medium rounded border"
        style={{
          backgroundColor: colors_priority.bg,
          color: colors_priority.text,
          fontSize: fonts.caption.small.size,
        }}
      >
        {colors_priority.label}
      </span>
    );
  };

  const formatInitials = (
    value: string | { firstName: string; lastName: string } | null,
  ) => {
    if (!value) return "";
    const name =
      typeof value === "string"
        ? value
        : `${value.firstName} ${value.lastName}`;
    return name
      .split(" ")
      .filter((segment) => segment.length > 0)
      .map((segment) => segment[0])
      .join("");
  };

  const formatFullName = (
    value: string | { firstName: string; lastName: string } | null,
  ) => {
    if (!value) return "Unknown";
    return typeof value === "string"
      ? value
      : `${value.firstName} ${value.lastName}`;
  };

  const getRelationName = (value: string | { name: string } | undefined) => {
    if (!value) return "Unknown";
    return typeof value === "string" ? value : value.name;
  };

  const getRelativeTime = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const ticketColumns = [
    {
      key: "id",
      title: "Ticket ID",
      render: (value: string) => (
        <span
          className="font-medium"
          style={{
            color: theme.primary,
            fontSize: fonts.body.sm.size,
            fontWeight: fonts.fontWeight.medium,
          }}
        >
          {value}
        </span>
      ),
    },
    {
      key: "title",
      title: "Title",
      render: (value: string, row: any) => (
        <div>
          <div
            className="font-medium"
            style={{
              fontSize: fonts.body.regular.size,
              fontWeight: fonts.fontWeight.medium,
              color: theme.foreground,
            }}
          >
            {value}
          </div>
          <div
            style={{
              fontSize: fonts.caption.regular.size,
              color: theme.foregroundMuted,
            }}
          >
            {getRelationName(row.department)} • {getRelativeTime(row.createdAt)}
          </div>
        </div>
      ),
    },
    {
      key: "requester",
      title: "Requester",
      render: (
        value: { firstName: string; lastName: string } | string | null,
      ) => (
        <div className="flex items-center">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
            style={{ backgroundColor: theme.accent }}
          >
            <span
              className="font-medium"
              style={{
                fontSize: fonts.caption.regular.size,
                color: theme.accentForeground,
              }}
            >
              {formatInitials(value)}
            </span>
          </div>
          <span
            style={{
              fontSize: fonts.body.sm.size,
              color: theme.foreground,
            }}
          >
            {formatFullName(value)}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      title: "Category",
      render: (value: string | { name: string }) => (
        <span
          className="px-2 py-1 text-xs font-medium rounded"
          style={{
            backgroundColor: theme.accent,
            color: theme.accentForeground,
            fontSize: fonts.caption.small.size,
          }}
        >
          {getRelationName(value)}
        </span>
      ),
    },
    {
      key: "assignee",
      title: "Assignee",
      render: (
        value: { firstName: string; lastName: string } | string | null,
      ) => (
        <div className="flex items-center">
          {value ? (
            <>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
                style={{ backgroundColor: theme.accent }}
              >
                <span
                  className="font-medium"
                  style={{
                    fontSize: fonts.caption.small.size,
                    color: theme.primary,
                  }}
                >
                  {formatInitials(value)}
                </span>
              </div>
              <span
                style={{
                  fontSize: fonts.body.sm.size,
                  color: theme.foreground,
                }}
              >
                {formatFullName(value)}
              </span>
            </>
          ) : (
            <span
              style={{
                fontSize: fonts.body.sm.size,
                color: theme.foregroundMuted,
                fontStyle: "italic",
              }}
            >
              Unassigned
            </span>
          )}
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: "priority",
      title: "Priority",
      render: (value: string) => getPriorityBadge(value),
    },
    {
      key: "date",
      title: "Date",
      render: (value: string) => (
        <span
          style={{
            fontSize: fonts.body.sm.size,
            color: theme.foregroundMuted,
          }}
        >
          {value}
        </span>
      ),
    },
  ];

  // Button handlers
  const handleExportData = () => {
    if (!dashboardData) return;

    // Export dashboard data as CSV
    const csvData = [
      ["Metric", "Value"],
      ["Total Tickets", dashboardData.stats.totalTickets.toString()],
      ["Open Tickets", dashboardData.stats.openTickets.toString()],
      ["Closed Today", dashboardData.stats.closedToday.toString()],
      ["Overdue", dashboardData.stats.overdueTickets.toString()],
      ["", ""],
      ["Department", "Tickets"],
      ...dashboardData.charts.ticketsByDepartment.map(d => [d.department, d.count.toString()])
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "dashboard-summary.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("CSV exported successfully", "success");
  };

  const handleRefresh = () => {
    toast("Refreshing dashboard...", "info");
    loadDashboardData();
  };

  const topBarActions = (
    <>
      <ActionButton
        variant="outline"
        size="sm"
        icon={Download}
        onClick={handleExportData}
      >
        Export Data
      </ActionButton>
      <ActionButton
        variant="primary"
        size="sm"
        icon={RefreshCw}
        onClick={handleRefresh}
      >
        Refresh
      </ActionButton>
    </>
  );

  return (
    <PageLayout>
      <TopBar
        title="Admin Command Center"
        subtitle="Real-time oversight of help desk performance and ticket lifecycle."
        actions={topBarActions}
      />

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            className="animate-slideInLeft"
            style={{ animationDelay: "100ms" }}
          >
            <StatCard
              title="Total Tickets"
              value={dashboardData.stats.totalTickets.toLocaleString()}
              icon={Ticket}
            />
          </div>
          <div
            className="animate-slideInLeft"
            style={{ animationDelay: "200ms" }}
          >
            <StatCard
              title="Open Tickets"
              value={dashboardData.stats.openTickets.toLocaleString()}
              icon={AlertTriangle}
              iconColor="#ea580c"
            />
          </div>
          <div
            className="animate-slideInLeft"
            style={{ animationDelay: "300ms" }}
          >
            <StatCard
              title="Closed Today"
              value={dashboardData.stats.closedToday.toLocaleString()}
              icon={CheckCircle}
              iconColor="#15803d"
            />
          </div>
          <div
            className="animate-slideInLeft"
            style={{ animationDelay: "400ms" }}
          >
            <StatCard
              title="Overdue"
              value={dashboardData.stats.overdueTickets.toLocaleString()}
              icon={Clock}
              iconColor="#dc2626"
            />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card
            className="shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer rounded-2xl border-2"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--card-border)",
              borderRadius: "16px",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.primary;
              e.currentTarget.style.boxShadow = `0 10px 25px -5px rgba(20, 184, 166, 0.3), 0 0 20px rgba(20, 184, 166, 0.2)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--card-border)";
              e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
            }}
          >
            <div className="p-6">
              <h3
                className="font-semibold mb-6"
                style={{
                  fontSize: fonts.heading.sm.size,
                  fontWeight: fonts.heading.sm.weight,
                  color: theme.foreground,
                }}
              >
                Tickets by Status
              </h3>
              <PieChart
                series={[
                  dashboardData.charts.ticketsByStatus.resolved,
                  dashboardData.charts.ticketsByStatus.pending,
                  dashboardData.charts.ticketsByStatus.overdue
                ]}
                labels={["Resolved", "Pending", "Overdue"]}
                colors={[theme.primary, "#f59e0b", "#ef4444"]}
                height={240}
              />
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <span
                      style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundMuted,
                      }}
                    >
                      Resolved
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: fonts.body.sm.size,
                      fontWeight: fonts.fontWeight.semibold,
                      color: theme.foreground,
                    }}
                  >
                    {dashboardData.charts.ticketsByStatus.resolved}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                    <span
                      style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundMuted,
                      }}
                    >
                      Pending
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: fonts.body.sm.size,
                      fontWeight: fonts.fontWeight.semibold,
                      color: theme.foreground,
                    }}
                  >
                    {dashboardData.charts.ticketsByStatus.pending}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                    <span
                      style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundMuted,
                      }}
                    >
                      Overdue
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: fonts.body.sm.size,
                      fontWeight: fonts.fontWeight.semibold,
                      color: theme.foreground,
                    }}
                  >
                    {dashboardData.charts.ticketsByStatus.overdue}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card
            className="shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer rounded-2xl border-2"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--card-border)",
              borderRadius: "16px",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.primary;
              e.currentTarget.style.boxShadow = `0 10px 25px -5px rgba(20, 184, 166, 0.3), 0 0 20px rgba(20, 184, 166, 0.2)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--card-border)";
              e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
            }}
          >
            <div className="p-6">
              <h3
                className="font-semibold mb-6"
                style={{
                  fontSize: fonts.heading.sm.size,
                  fontWeight: fonts.heading.sm.weight,
                  color: theme.foreground,
                }}
              >
                Tickets by Department
              </h3>
              <BarChart
                categories={dashboardData.charts.ticketsByDepartment.map(d => d.department)}
                series={[{
                  name: "Tickets",
                  data: dashboardData.charts.ticketsByDepartment.map(d => d.count)
                }]}
                height={240}
                horizontal={false}
                xAxisTitle="Department"
                yAxisTitle="Tickets"
              />
            </div>
          </Card>

          <Card
            className="shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer rounded-2xl border-2"
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--card-border)",
              borderRadius: "16px",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.primary;
              e.currentTarget.style.boxShadow = `0 10px 25px -5px rgba(20, 184, 166, 0.3), 0 0 20px rgba(20, 184, 166, 0.2)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--card-border)";
              e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
            }}
          >
            <div className="p-6">
              <h3
                className="font-semibold mb-6"
                style={{
                  fontSize: fonts.heading.sm.size,
                  fontWeight: fonts.heading.sm.weight,
                  color: theme.foreground,
                }}
              >
                Tickets by Month
              </h3>
              <LineChart
                categories={dashboardData.charts.monthlyTickets.labels}
                series={[{
                  name: "Tickets",
                  data: dashboardData.charts.monthlyTickets.data
                }]}
                height={240}
                xAxisTitle="Month"
                yAxisTitle="Tickets"
              />
            </div>
          </Card>
        </div>

        {/* Search Filter */}
        <SearchFilter
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search tickets..."
        />

        {/* Global Ticket Log */}
        {(() => {
          const filteredTickets = dashboardData.recentTickets.filter(
            (ticket) =>
              ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              `${ticket.requester.firstName} ${ticket.requester.lastName}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
          );

          const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

          return (
            <>
              <DataTable
                title={`Global Ticket Log (${filteredTickets.length})`}
                columns={ticketColumns}
                data={paginatedTickets}
                emptyMessage="No tickets found matching your search."
              />

              {filteredTickets.length > 0 && (
                <div
                  className="flex items-center justify-between px-6 py-4 rounded-lg shadow-sm"
                  style={{
                    backgroundColor: theme.card,
                    borderColor: theme.cardBorder,
                    border: "1px solid",
                  }}
                >
                  <div
                    style={{
                      fontSize: fonts.body.sm.size,
                      color: theme.foregroundMuted,
                    }}
                  >
                    Showing {startIndex + 1} to{" "}
                    {Math.min(endIndex, filteredTickets.length)} of{" "}
                    {filteredTickets.length} tickets
                  </div>
                  <div className="flex items-center gap-2">
                    <ActionButton
                      variant="outline"
                      size="sm"
                      icon={ChevronLeft}
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(1, prev - 1));
                      }}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </ActionButton>
                    <span
                      style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foreground,
                        fontWeight: fonts.fontWeight.medium,
                        padding: '0 12px'
                      }}
                    >
                      Page {currentPage} of {totalPages}
                    </span>
                    <ActionButton
                      variant="outline"
                      size="sm"
                      icon={ChevronRight}
                      onClick={() => {
                        setCurrentPage((prev) =>
                          Math.min(totalPages, prev + 1),
                        );
                      }}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </ActionButton>
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>
    </PageLayout>
  );
}
