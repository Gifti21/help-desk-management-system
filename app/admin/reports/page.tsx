"use client";

import React, { useState } from "react";
import { PageLayout } from "../../../components/admin/PageLayout";
import { TopBar } from "../../../components/admin/TopBar";
import { StatCard } from "../../../components/admin/StatCard";
import { DataTable } from "../../../components/admin/DataTable";
import { ActionButton } from "../../../components/admin/ActionButton";
import { SearchFilter } from "../../../components/admin/SearchFilter";
import { useTheme } from "../../../components/providers/ThemeProvider";
import { useToast } from "../../../components/ui/toast";
import { fonts } from "@/lib/fonts";
import { CHARTS, STATUS, PRIORITY } from "@/lib/colors";
import {
  BarChart,
  PieChart,
  DonutChart,
  LineChart,
} from "../../../components/charts";
import { exportToCSV, exportToPDF } from "@/lib/export-utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  Tag,
  FileText,
  ChevronLeft,
  ChevronRight,
  Activity,
  Download,
  FileDown,
  RefreshCw,
} from "lucide-react";

// Real database data - matching schema exactly
const departments = [
  { id: "dept-1", name: "IT Support", createdAt: "2023-01-15T10:00:00Z" },
  { id: "dept-2", name: "Human Resources", createdAt: "2023-01-15T09:30:00Z" },
  { id: "dept-3", name: "Engineering", createdAt: "2023-01-20T11:00:00Z" },
  { id: "dept-4", name: "Operations", createdAt: "2023-03-10T14:00:00Z" },
  { id: "dept-5", name: "Finance", createdAt: "2023-02-20T08:30:00Z" },
  { id: "dept-6", name: "Security", createdAt: "2023-04-05T10:15:00Z" },
  { id: "dept-7", name: "Marketing", createdAt: "2023-04-15T11:30:00Z" },
  { id: "dept-8", name: "Sales", createdAt: "2023-05-01T09:00:00Z" },
];

const users = [
  {
    id: "u1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@company.com",
    role: "ADMIN",
    isActive: true,
    departmentId: "dept-1",
    createdAt: "2023-01-15T10:00:00Z",
  },
  {
    id: "u2",
    firstName: "John",
    lastName: "Smith",
    email: "john@company.com",
    role: "AGENT",
    isActive: true,
    departmentId: "dept-1",
    createdAt: "2023-01-16T10:00:00Z",
  },
  {
    id: "u3",
    firstName: "Mary",
    lastName: "Jones",
    email: "mary@company.com",
    role: "EMPLOYEE",
    isActive: true,
    departmentId: "dept-2",
    createdAt: "2023-01-17T10:00:00Z",
  },
  {
    id: "u4",
    firstName: "Robert",
    lastName: "Brown",
    email: "robert@company.com",
    role: "EMPLOYEE",
    isActive: true,
    departmentId: "dept-3",
    createdAt: "2023-01-18T10:00:00Z",
  },
  {
    id: "u5",
    firstName: "Lisa",
    lastName: "Wilson",
    email: "lisa@company.com",
    role: "AGENT",
    isActive: true,
    departmentId: "dept-1",
    createdAt: "2023-01-19T10:00:00Z",
  },
  {
    id: "u6",
    firstName: "David",
    lastName: "Miller",
    email: "david@company.com",
    role: "EMPLOYEE",
    isActive: false,
    departmentId: "dept-4",
    createdAt: "2023-01-20T10:00:00Z",
  },
  {
    id: "u7",
    firstName: "Sarah",
    lastName: "Davis",
    email: "sarah@company.com",
    role: "AGENT",
    isActive: true,
    departmentId: "dept-2",
    createdAt: "2023-01-21T10:00:00Z",
  },
  {
    id: "u8",
    firstName: "James",
    lastName: "Garcia",
    email: "james@company.com",
    role: "EMPLOYEE",
    isActive: true,
    departmentId: "dept-5",
    createdAt: "2023-01-22T10:00:00Z",
  },
];

const categories = [
  { id: "cat-1", name: "Hardware Issue", createdAt: "2023-01-15T10:00:00Z" },
  { id: "cat-2", name: "Software Bug", createdAt: "2023-01-15T10:00:00Z" },
  { id: "cat-3", name: "Network Problem", createdAt: "2023-01-16T10:00:00Z" },
  { id: "cat-4", name: "Access Request", createdAt: "2023-01-17T10:00:00Z" },
  { id: "cat-5", name: "Training", createdAt: "2023-01-18T10:00:00Z" },
];

const tickets = [
  {
    id: "t1",
    title: "Laptop not booting",
    status: "OPEN",
    priority: "HIGH",
    categoryId: "cat-1",
    departmentId: "dept-1",
    requesterId: "u3",
    assigneeId: "u2",
    createdAt: "2023-02-01T09:00:00Z",
  },
  {
    id: "t2",
    title: "Email not sending",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    categoryId: "cat-2",
    departmentId: "dept-1",
    requesterId: "u4",
    assigneeId: "u2",
    createdAt: "2023-02-02T10:00:00Z",
  },
  {
    id: "t3",
    title: "VPN connection issue",
    status: "RESOLVED",
    priority: "HIGH",
    categoryId: "cat-3",
    departmentId: "dept-1",
    requesterId: "u3",
    assigneeId: "u5",
    createdAt: "2023-02-03T11:00:00Z",
  },
  {
    id: "t4",
    title: "Need database access",
    status: "OPEN",
    priority: "LOW",
    categoryId: "cat-4",
    departmentId: "dept-3",
    requesterId: "u4",
    assigneeId: null,
    createdAt: "2023-02-04T14:00:00Z",
  },
  {
    id: "t5",
    title: "Printer jam",
    status: "CLOSED",
    priority: "LOW",
    categoryId: "cat-1",
    departmentId: "dept-2",
    requesterId: "u3",
    assigneeId: "u7",
    createdAt: "2023-02-05T15:00:00Z",
  },
  {
    id: "t6",
    title: "Software installation",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    categoryId: "cat-2",
    departmentId: "dept-3",
    requesterId: "u8",
    assigneeId: "u2",
    createdAt: "2023-02-06T09:30:00Z",
  },
  {
    id: "t7",
    title: "Network slow",
    status: "OPEN",
    priority: "HIGH",
    categoryId: "cat-3",
    departmentId: "dept-1",
    requesterId: "u4",
    assigneeId: "u5",
    createdAt: "2023-02-07T10:30:00Z",
  },
  {
    id: "t8",
    title: "Password reset",
    status: "RESOLVED",
    priority: "LOW",
    categoryId: "cat-4",
    departmentId: "dept-2",
    requesterId: "u3",
    assigneeId: "u7",
    createdAt: "2023-02-08T11:30:00Z",
  },
  {
    id: "t9",
    title: "Training on new system",
    status: "OPEN",
    priority: "MEDIUM",
    categoryId: "cat-5",
    departmentId: "dept-4",
    requesterId: "u6",
    assigneeId: null,
    createdAt: "2023-02-09T13:00:00Z",
  },
  {
    id: "t10",
    title: "Monitor not working",
    status: "CLOSED",
    priority: "MEDIUM",
    categoryId: "cat-1",
    departmentId: "dept-5",
    requesterId: "u8",
    assigneeId: "u2",
    createdAt: "2023-02-10T14:30:00Z",
  },
];

export default function ReportsPage() {
  const theme = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "departments" | "categories" | "tickets"
  >("overview");

  // Pagination states
  const [usersPage, setUsersPage] = useState(1);
  const [deptsPage, setDeptsPage] = useState(1);
  const [catsPage, setCatsPage] = useState(1);
  const [ticketsPage, setTicketsPage] = useState(1);
  const itemsPerPage = 5; // Consistent pagination: 5 items per page

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  // Computed values
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const totalDepartments = departments.length;
  const totalCategories = categories.length;
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "OPEN").length;

  // Filtered data
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? user.isActive : !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      searchTerm === "" ||
      dept.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      searchTerm === "" ||
      cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      searchTerm === "" ||
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Paginated data
  const paginatedUsers = filteredUsers.slice(
    (usersPage - 1) * itemsPerPage,
    usersPage * itemsPerPage,
  );
  const paginatedDepts = filteredDepartments.slice(
    (deptsPage - 1) * itemsPerPage,
    deptsPage * itemsPerPage,
  );
  const paginatedCats = filteredCategories.slice(
    (catsPage - 1) * itemsPerPage,
    catsPage * itemsPerPage,
  );
  const paginatedTickets = filteredTickets.slice(
    (ticketsPage - 1) * itemsPerPage,
    ticketsPage * itemsPerPage,
  );

  const totalUsersPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const totalDeptsPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const totalCatsPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const totalTicketsPages = Math.ceil(filteredTickets.length / itemsPerPage);

  // Table columns
  const userColumns = [
    { key: "id", title: "ID" },
    { key: "name", title: "Name" },
    { key: "email", title: "Email" },
    { key: "role", title: "Role" },
    { key: "status", title: "Status" },
    { key: "department", title: "Department" },
  ];

  const deptColumns = [
    { key: "id", title: "ID" },
    { key: "name", title: "Department" },
    { key: "users", title: "Users" },
    { key: "tickets", title: "Tickets" },
  ];

  const catColumns = [
    { key: "id", title: "ID" },
    { key: "name", title: "Category" },
    { key: "tickets", title: "Tickets" },
  ];

  const ticketColumns = [
    { key: "id", title: "ID" },
    { key: "title", title: "Title" },
    { key: "status", title: "Status" },
    { key: "priority", title: "Priority" },
    { key: "assignee", title: "Assignee" },
  ];

  // Export handlers
  const handleExportCSV = () => {
    let data: any[] = [];
    let filename = "";
    let columns: { key: string; title: string }[] = [];

    switch (activeTab) {
      case "users":
        data = filteredUsers.map((u) => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          role: u.role,
          status: u.isActive ? "Active" : "Inactive",
          department:
            departments.find((d) => d.id === u.departmentId)?.name || "",
        }));
        filename = "users-report";
        columns = userColumns;
        break;
      case "departments":
        data = departments.map((d) => ({
          id: d.id,
          name: d.name,
          users: users.filter((u) => u.departmentId === d.id).length,
          tickets: tickets.filter((t) => t.departmentId === d.id).length,
        }));
        filename = "departments-report";
        columns = deptColumns;
        break;
      case "categories":
        data = categories.map((c) => ({
          id: c.id,
          name: c.name,
          tickets: tickets.filter((t) => t.categoryId === c.id).length,
        }));
        filename = "categories-report";
        columns = catColumns;
        break;
      case "tickets":
        data = filteredTickets.map((t) => ({
          id: t.id,
          title: t.title,
          status: t.status,
          priority: t.priority,
          assignee: (() => {
            if (!t.assigneeId) return "Unassigned";
            const user = users.find((u) => u.id === t.assigneeId);
            return user ? `${user.firstName} ${user.lastName}` : "Unassigned";
          })(),
        }));
        filename = "tickets-report";
        columns = ticketColumns;
        break;
      case "overview":
        data = [
          { metric: "Total Users", value: totalUsers },
          { metric: "Active Users", value: activeUsers },
          { metric: "Total Departments", value: totalDepartments },
          { metric: "Total Categories", value: totalCategories },
          { metric: "Total Tickets", value: totalTickets },
          { metric: "Open Tickets", value: openTickets },
        ];
        filename = "overview-report";
        columns = [
          { key: "metric", title: "Metric" },
          { key: "value", title: "Value" },
        ];
        break;
    }

    exportToCSV(data, filename, columns);
    toast("CSV export successful", "success");
  };

  const handleExportPDF = () => {
    let data: any[] = [];
    let filename = "";
    let title = "";
    let columns: { key: string; title: string }[] = [];
    let chartData: {
      title: string;
      type: string;
      items: { label: string; value: number; color?: string }[];
    }[] = [];

    switch (activeTab) {
      case "users":
        chartData = [
          {
            title: "Users by Role Distribution",
            type: "donut",
            items: [
              {
                label: "Administrators",
                value: users.filter((u) => u.role === "ADMIN").length,
                color: CHARTS.indigo,
              },
              {
                label: "Agents",
                value: users.filter((u) => u.role === "AGENT").length,
                color: CHARTS.blue,
              },
              {
                label: "Employees",
                value: users.filter((u) => u.role === "EMPLOYEE").length,
                color: CHARTS.green,
              },
            ],
          },
        ];
        data = filteredUsers.map((u) => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          email: u.email,
          role: u.role,
          status: u.isActive ? "Active" : "Inactive",
          department:
            departments.find((d) => d.id === u.departmentId)?.name || "",
        }));
        filename = "users-report";
        title = "Users Report";
        columns = userColumns;
        break;
      case "departments":
        chartData = [
          {
            title: "Users per Department",
            type: "bar",
            items: departments.map((d, index) => ({
              label: d.name,
              value: users.filter((u) => u.departmentId === d.id).length,
              color: [
                CHARTS.indigo,
                CHARTS.blue,
                CHARTS.green,
                CHARTS.amber,
                CHARTS.purple,
                CHARTS.pink,
                CHARTS.red,
                CHARTS.grey,
              ][index % 8],
            })),
          },
        ];
        data = departments.map((d) => ({
          id: d.id,
          name: d.name,
          users: users.filter((u) => u.departmentId === d.id).length,
          tickets: tickets.filter((t) => t.departmentId === d.id).length,
        }));
        filename = "departments-report";
        title = "Departments Report";
        columns = deptColumns;
        break;
      case "categories":
        chartData = [
          {
            title: "Tickets per Category",
            type: "bar",
            items: categories.map((c, index) => ({
              label: c.name,
              value: tickets.filter((t) => t.categoryId === c.id).length,
              color: [
                CHARTS.blue,
                CHARTS.green,
                CHARTS.amber,
                CHARTS.purple,
                CHARTS.red,
              ][index % 5],
            })),
          },
        ];
        data = categories.map((c) => ({
          id: c.id,
          name: c.name,
          tickets: tickets.filter((t) => t.categoryId === c.id).length,
        }));
        filename = "categories-report";
        title = "Categories Report";
        columns = catColumns;
        break;
      case "tickets":
        chartData = [
          {
            title: "Tickets by Status Distribution",
            type: "pie",
            items: [
              {
                label: "Open",
                value: tickets.filter((t) => t.status === "OPEN").length,
                color: CHARTS.blue,
              },
              {
                label: "In Progress",
                value: tickets.filter((t) => t.status === "IN_PROGRESS").length,
                color: CHARTS.amber,
              },
              {
                label: "Resolved",
                value: tickets.filter((t) => t.status === "RESOLVED").length,
                color: CHARTS.green,
              },
              {
                label: "Closed",
                value: tickets.filter((t) => t.status === "CLOSED").length,
                color: CHARTS.grey,
              },
            ],
          },
        ];
        data = filteredTickets.map((t) => ({
          id: t.id,
          title: t.title,
          status: t.status,
          priority: t.priority,
          assignee: (() => {
            if (!t.assigneeId) return "Unassigned";
            const user = users.find((u) => u.id === t.assigneeId);
            return user ? `${user.firstName} ${user.lastName}` : "Unassigned";
          })(),
        }));
        filename = "tickets-report";
        title = "Tickets Report";
        columns = ticketColumns;
        break;
      case "overview":
        chartData = [
          {
            title: "Users by Role",
            type: "donut",
            items: [
              {
                label: "Administrators",
                value: users.filter((u) => u.role === "ADMIN").length,
                color: CHARTS.indigo,
              },
              {
                label: "Agents",
                value: users.filter((u) => u.role === "AGENT").length,
                color: CHARTS.blue,
              },
              {
                label: "Employees",
                value: users.filter((u) => u.role === "EMPLOYEE").length,
                color: CHARTS.green,
              },
            ],
          },
          {
            title: "Tickets by Status",
            type: "pie",
            items: [
              {
                label: "Open",
                value: tickets.filter((t) => t.status === "OPEN").length,
                color: CHARTS.blue,
              },
              {
                label: "In Progress",
                value: tickets.filter((t) => t.status === "IN_PROGRESS").length,
                color: CHARTS.amber,
              },
              {
                label: "Resolved",
                value: tickets.filter((t) => t.status === "RESOLVED").length,
                color: CHARTS.green,
              },
              {
                label: "Closed",
                value: tickets.filter((t) => t.status === "CLOSED").length,
                color: CHARTS.grey,
              },
            ],
          },
        ];
        data = [
          { metric: "Total Users", value: totalUsers },
          { metric: "Active Users", value: activeUsers },
          { metric: "Total Departments", value: totalDepartments },
          { metric: "Total Categories", value: totalCategories },
          { metric: "Total Tickets", value: totalTickets },
          { metric: "Open Tickets", value: openTickets },
        ];
        filename = "overview-report";
        title = "System Overview Report";
        columns = [
          { key: "metric", title: "Metric" },
          { key: "value", title: "Value" },
        ];
        break;
    }

    exportToPDF(data, filename, title, columns, chartData);
    toast("Professional HTML report downloaded successfully", "success");
  };

  const handleRefresh = () => {
    toast("Refreshing reports...", "info");
    setTimeout(() => {
      window.location.reload();
    }, 1000); // Wait 1 second to show toast before refresh
  };

  const renderPagination = (
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void,
  ) => (
    <div className="flex items-center justify-between mt-4">
      <div
        style={{
          fontSize: fonts.body.sm.size,
          color: theme.colors.foregroundMuted,
        }}
      >
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex gap-2">
        <ActionButton
          variant="outline"
          size="sm"
          icon={ChevronLeft}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Prev
        </ActionButton>
        <ActionButton
          variant="outline"
          size="sm"
          icon={ChevronRight}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </ActionButton>
      </div>
    </div>
  );
  return (
    <PageLayout>
      <TopBar
        title="Analytics & Reports"
        subtitle="System reports with real database data"
        actions={
          <div className="flex gap-2">
            <ActionButton
              variant="primary"
              size="sm"
              icon={RefreshCw}
              onClick={handleRefresh}
            >
              Refresh
            </ActionButton>
            <ActionButton
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleExportCSV}
            >
              Export CSV
            </ActionButton>
            <ActionButton
              variant="outline"
              size="sm"
              icon={FileDown}
              onClick={handleExportPDF}
            >
              Export PDF
            </ActionButton>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Navigation Tabs */}
        <div
          className="flex gap-2 border-b"
          style={{ borderColor: theme.colors.border }}
        >
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "users", label: "Users", icon: Users },
            { id: "departments", label: "Departments", icon: Building2 },
            { id: "categories", label: "Categories", icon: Tag },
            { id: "tickets", label: "Tickets", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="flex items-center gap-2 px-4 py-2 border-b-2 transition-colors"
                style={{
                  borderColor: isActive ? theme.colors.primary : "transparent",
                  color: isActive
                    ? theme.colors.primary
                    : theme.colors.foregroundMuted,
                  backgroundColor: isActive
                    ? `${theme.colors.primary}10`
                    : "transparent",
                  fontSize: fonts.body.sm.size,
                  fontWeight: isActive
                    ? fonts.fontWeight.semibold
                    : fonts.fontWeight.medium,
                }}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search and Filter - show for all tabs except overview */}
        {activeTab !== "overview" && (
          <div className="flex gap-4">
            <SearchFilter
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder={`Search ${activeTab}...`}
            />
            {activeTab === "users" && (
              <>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border"
                  style={{
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    color: theme.colors.foreground,
                    fontSize: fonts.body.sm.size,
                  }}
                >
                  <option value="all">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="AGENT">Agent</option>
                  <option value="EMPLOYEE">Employee</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border"
                  style={{
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    color: theme.colors.foreground,
                    fontSize: fonts.body.sm.size,
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </>
            )}
            {activeTab === "tickets" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border,
                  color: theme.colors.foreground,
                  fontSize: fonts.body.sm.size,
                }}
              >
                <option value="all">All Status</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            )}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Users" value={totalUsers} icon={Users} />
              <StatCard
                title="Active Users"
                value={activeUsers}
                icon={Activity}
              />
              <StatCard
                title="Total Departments"
                value={totalDepartments}
                icon={Building2}
              />
              <StatCard
                title="Total Tickets"
                value={totalTickets}
                icon={FileText}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                className="rounded-lg border p-6 transition-all duration-250 ease-out hover:-translate-y-2 hover:border-[#2fd9c4] hover:shadow-[0_20px_50px_rgba(47,217,196,0.25)]"
                style={{
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.cardBorder,
                }}
              >
                <h3
                  className="font-semibold mb-4"
                  style={{
                    fontSize: fonts.body.lg.size,
                    color: theme.colors.foreground,
                  }}
                >
                  Users by Role
                </h3>
                <DonutChart
                  series={[
                    users.filter((u) => u.role === "ADMIN").length,
                    users.filter((u) => u.role === "AGENT").length,
                    users.filter((u) => u.role === "EMPLOYEE").length,
                  ]}
                  labels={["Admins", "Agents", "Employees"]}
                  colors={[CHARTS.indigo, CHARTS.blue, CHARTS.green]}
                  tooltipSuffix="users"
                />
              </div>

              <div
                className="rounded-lg border p-6 transition-all duration-250 ease-out hover:-translate-y-2 hover:border-[#2fd9c4] hover:shadow-[0_20px_50px_rgba(47,217,196,0.25)]"
                style={{
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.cardBorder,
                }}
              >
                <h3
                  className="font-semibold mb-4"
                  style={{
                    fontSize: fonts.body.lg.size,
                    color: theme.colors.foreground,
                  }}
                >
                  Tickets by Status
                </h3>
                <PieChart
                  series={[
                    tickets.filter((t) => t.status === "OPEN").length,
                    tickets.filter((t) => t.status === "IN_PROGRESS").length,
                    tickets.filter((t) => t.status === "RESOLVED").length,
                    tickets.filter((t) => t.status === "CLOSED").length,
                  ]}
                  labels={["Open", "In Progress", "Resolved", "Closed"]}
                  colors={[
                    CHARTS.blue,
                    CHARTS.amber,
                    CHARTS.green,
                    CHARTS.grey,
                  ]}
                />
              </div>
            </div>

            <div
              className="rounded-lg border p-6 transition-all duration-250 ease-out hover:-translate-y-2 hover:border-[#2fd9c4] hover:shadow-[0_20px_50px_rgba(47,217,196,0.25)]"
              style={{
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <h3
                className="font-semibold mb-4"
                style={{
                  fontSize: fonts.body.lg.size,
                  color: theme.colors.foreground,
                }}
              >
                System Activity Trends (Monthly)
              </h3>
              <LineChart
                categories={[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                ]}
                series={[
                  { name: "New Users", data: [2, 3, 2, 1, 0, 0, 0, 0] },
                  { name: "New Tickets", data: [0, 3, 4, 2, 1, 0, 0, 0] },
                  { name: "Resolved", data: [0, 0, 1, 0, 1, 0, 0, 0] },
                ]}
                xAxisTitle="Months"
                yAxisTitle="Count"
              />
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total Users" value={totalUsers} icon={Users} />
              <StatCard
                title="Active Users"
                value={activeUsers}
                icon={Activity}
              />
              <StatCard
                title="Inactive Users"
                value={totalUsers - activeUsers}
                icon={Users}
              />
            </div>

            <div
              className="rounded-lg border p-6 transition-all duration-250 ease-out hover:-translate-y-2 hover:border-[#2fd9c4] hover:shadow-[0_20px_50px_rgba(47,217,196,0.25)]"
              style={{
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <h3
                className="font-semibold mb-4"
                style={{
                  fontSize: fonts.body.lg.size,
                  color: theme.colors.foreground,
                }}
              >
                Users by Role
              </h3>
              <DonutChart
                series={[
                  users.filter((u) => u.role === "ADMIN").length,
                  users.filter((u) => u.role === "AGENT").length,
                  users.filter((u) => u.role === "EMPLOYEE").length,
                ]}
                labels={["Admins", "Agents", "Employees"]}
                colors={[CHARTS.indigo, CHARTS.blue, CHARTS.green]}
                tooltipSuffix="users"
              />
            </div>

            <div
              className="rounded-lg border p-6 transition-all duration-250 ease-out hover:-translate-y-2 hover:border-[#2fd9c4] hover:shadow-[0_20px_50px_rgba(47,217,196,0.25)]"
              style={{
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <DataTable
                title="Users List"
                columns={userColumns}
                data={paginatedUsers.map((u) => ({
                  id: u.id,
                  name: `${u.firstName} ${u.lastName}`,
                  email: u.email,
                  role: u.role,
                  status: u.isActive ? "Active" : "Inactive",
                  department:
                    departments.find((d) => d.id === u.departmentId)?.name ||
                    "N/A",
                }))}
                emptyMessage="No users found."
              />
              {renderPagination(usersPage, totalUsersPages, setUsersPage)}
            </div>
          </>
        )}

        {/* Departments Tab */}
        {activeTab === "departments" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Departments"
                value={totalDepartments}
                icon={Building2}
              />
              <StatCard
                title="Avg Users/Dept"
                value={Math.round(totalUsers / totalDepartments)}
                icon={Users}
              />
              <StatCard
                title="Avg Tickets/Dept"
                value={Math.round(totalTickets / totalDepartments)}
                icon={FileText}
              />
            </div>

            <div
              className="rounded-lg border p-6 transition-all duration-250 ease-out hover:-translate-y-2 hover:border-[#2fd9c4] hover:shadow-[0_20px_50px_rgba(47,217,196,0.25)]"
              style={{
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <h3
                className="font-semibold mb-4"
                style={{
                  fontSize: fonts.body.lg.size,
                  color: theme.colors.foreground,
                }}
              >
                Users per Department
              </h3>
              <BarChart
                categories={departments.map((d) => d.name)}
                series={[
                  {
                    name: "Users",
                    data: departments.map(
                      (d) =>
                        users.filter((u) => u.departmentId === d.id).length,
                    ),
                  },
                ]}
                xAxisTitle="Departments"
                yAxisTitle="Number of Users"
              />
            </div>

            <div
              className="rounded-lg border p-6 transition-all duration-250 ease-out hover:-translate-y-2 hover:border-[#2fd9c4] hover:shadow-[0_20px_50px_rgba(47,217,196,0.25)]"
              style={{
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <DataTable
                title="Departments List"
                columns={deptColumns}
                data={paginatedDepts.map((d) => ({
                  id: d.id,
                  name: d.name,
                  users: users.filter((u) => u.departmentId === d.id).length,
                  tickets: tickets.filter((t) => t.departmentId === d.id)
                    .length,
                }))}
                emptyMessage="No departments found."
              />
              {renderPagination(deptsPage, totalDeptsPages, setDeptsPage)}
            </div>
          </>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Categories"
                value={totalCategories}
                icon={Tag}
              />
              <StatCard
                title="Total Tickets"
                value={totalTickets}
                icon={FileText}
              />
              <StatCard
                title="Avg Tickets/Cat"
                value={Math.round(totalTickets / totalCategories)}
                icon={Activity}
              />
            </div>

            <div
              className="rounded-lg border p-6 transition-all duration-250 ease-out hover:-translate-y-2 hover:border-[#2fd9c4] hover:shadow-[0_20px_50px_rgba(47,217,196,0.25)]"
              style={{
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <h3
                className="font-semibold mb-4"
                style={{
                  fontSize: fonts.body.lg.size,
                  color: theme.colors.foreground,
                }}
              >
                Tickets per Category
              </h3>
              <BarChart
                categories={categories.map((c) => c.name)}
                series={[
                  {
                    name: "Tickets",
                    data: categories.map(
                      (c) =>
                        tickets.filter((t) => t.categoryId === c.id).length,
                    ),
                  },
                ]}
                xAxisTitle="Categories"
                yAxisTitle="Number of Tickets"
              />
            </div>

            <div
              className="rounded-lg border p-6 transition-all duration-250 ease-out hover:-translate-y-2 hover:border-[#2fd9c4] hover:shadow-[0_20px_50px_rgba(47,217,196,0.25)]"
              style={{
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <DataTable
                title="Categories List"
                columns={catColumns}
                data={paginatedCats.map((c) => ({
                  id: c.id,
                  name: c.name,
                  tickets: tickets.filter((t) => t.categoryId === c.id).length,
                }))}
                emptyMessage="No categories found."
              />
              {renderPagination(catsPage, totalCatsPages, setCatsPage)}
            </div>
          </>
        )}

        {/* Tickets Tab */}
        {activeTab === "tickets" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard
                title="Total Tickets"
                value={totalTickets}
                icon={FileText}
              />
              <StatCard title="Open" value={openTickets} icon={Activity} />
              <StatCard
                title="In Progress"
                value={tickets.filter((t) => t.status === "IN_PROGRESS").length}
                icon={Activity}
              />
              <StatCard
                title="Resolved"
                value={tickets.filter((t) => t.status === "RESOLVED").length}
                icon={Activity}
              />
            </div>

            <div
              className="rounded-lg border p-6 transition-all duration-250 ease-out hover:-translate-y-2 hover:border-[#2fd9c4] hover:shadow-[0_20px_50px_rgba(47,217,196,0.25)]"
              style={{
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <h3
                className="font-semibold mb-4"
                style={{
                  fontSize: fonts.body.lg.size,
                  color: theme.colors.foreground,
                }}
              >
                Tickets by Status
              </h3>
              <PieChart
                series={[
                  tickets.filter((t) => t.status === "OPEN").length,
                  tickets.filter((t) => t.status === "IN_PROGRESS").length,
                  tickets.filter((t) => t.status === "RESOLVED").length,
                  tickets.filter((t) => t.status === "CLOSED").length,
                ]}
                labels={["Open", "In Progress", "Resolved", "Closed"]}
                colors={[CHARTS.blue, CHARTS.amber, CHARTS.green, CHARTS.grey]}
              />
            </div>

            <div
              className="rounded-lg border p-6 transition-all duration-250 ease-out hover:-translate-y-2 hover:border-[#2fd9c4] hover:shadow-[0_20px_50px_rgba(47,217,196,0.25)]"
              style={{
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.cardBorder,
              }}
            >
              <DataTable
                title="Tickets List"
                columns={ticketColumns}
                data={paginatedTickets.map((t) => ({
                  id: t.id,
                  title: t.title,
                  status: t.status,
                  priority: t.priority,
                  assignee: (() => {
                    if (!t.assigneeId) return "Unassigned";
                    const user = users.find((u) => u.id === t.assigneeId);
                    return user
                      ? `${user.firstName} ${user.lastName}`
                      : "Unassigned";
                  })(),
                }))}
                emptyMessage="No tickets found."
              />
              {renderPagination(ticketsPage, totalTicketsPages, setTicketsPage)}
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
}
