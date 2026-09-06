"use client";

import { useState, useEffect } from "react";
import { PageLayout } from "../../../components/admin/PageLayout";
import { TopBar } from "../../../components/admin/TopBar";
import { StatCard } from "../../../components/admin/StatCard";
import { ActionButton } from "../../../components/admin/ActionButton";
import { DataTable } from "../../../components/admin/DataTable";
import { SearchFilter } from "../../../components/admin/SearchFilter";
import { ConfirmationDialog } from "../../../components/ui/confirmation-dialog";
import { useToast } from "../../../components/ui/toast";
import { useTheme } from "../../../components/providers/ThemeProvider";
import { fonts } from "@/lib/fonts";
import {
  Ticket as TicketIcon,
  AlertTriangle,
  Users,
  Download,
  Eye,
  UserPlus,
  Trash2,
  X,
  Check,
  CheckCircle,
  RotateCcw,
  Edit2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
} from "lucide-react";
import {
  getTickets,
  updateTicket,
  deleteTicket,
  type Ticket,
} from "@/lib/api/tickets";
import { getUsers, type User } from "@/lib/api/users";
import { getCategories, type Category } from "@/lib/api/categories";
import { getDepartments, type Department } from "@/lib/api/departments";

export default function TicketsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionsMenuOpen, setActionsMenuOpen] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 5;

  // Modals state
  const [viewModal, setViewModal] = useState<{
    isOpen: boolean;
    ticket: Ticket | null;
  }>({ isOpen: false, ticket: null });
  const [assignModal, setAssignModal] = useState<{
    isOpen: boolean;
    ticket: Ticket | null;
  }>({ isOpen: false, ticket: null });
  const [reassignModal, setReassignModal] = useState<{
    isOpen: boolean;
    ticket: Ticket | null;
  }>({ isOpen: false, ticket: null });
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    ticket: Ticket | null;
  }>({ isOpen: false, ticket: null });
  const [priorityModal, setPriorityModal] = useState<{
    isOpen: boolean;
    ticket: Ticket | null;
  }>({ isOpen: false, ticket: null });
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    ticket: Ticket | null;
  }>({ isOpen: false, ticket: null });
  const [closeDialog, setCloseDialog] = useState<{
    isOpen: boolean;
    ticket: Ticket | null;
  }>({ isOpen: false, ticket: null });
  const [reopenDialog, setReopenDialog] = useState<{
    isOpen: boolean;
    ticket: Ticket | null;
  }>({ isOpen: false, ticket: null });

  const { colors: theme } = useTheme();
  const { toast } = useToast();

  // Load data from API on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoadingData(true);
      const [ticketsData, usersData, categoriesData, departmentsData] =
        await Promise.all([
          getTickets(),
          getUsers(),
          getCategories(),
          getDepartments(),
        ]);
      setTickets(ticketsData);
      setUsers(usersData);
      setCategories(categoriesData);
      setDepartments(departmentsData);
    } catch (error: unknown) {
      toast(
        error instanceof Error ? error.message : "Failed to load data",
        "error",
      );
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleClose = async () => {
    if (!closeDialog.ticket) return;
    try {
      setIsSubmitting(true);
      const updatedTicket = await updateTicket(closeDialog.ticket.id, {
        status: "CLOSED",
      });
      setTickets((prev) =>
        prev.map((t) => (t.id === closeDialog.ticket!.id ? updatedTicket : t)),
      );
      setCloseDialog({ isOpen: false, ticket: null });
      toast("Ticket closed successfully", "success");
    } catch (error: any) {
      toast(error.message || "Failed to close ticket", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReopen = async () => {
    if (!reopenDialog.ticket) return;
    try {
      setIsSubmitting(true);
      const updatedTicket = await updateTicket(reopenDialog.ticket.id, {
        status: "OPEN",
      });
      setTickets((prev) =>
        prev.map((t) => (t.id === reopenDialog.ticket!.id ? updatedTicket : t)),
      );
      setReopenDialog({ isOpen: false, ticket: null });
      toast("Ticket reopened successfully", "success");
    } catch (error: any) {
      toast(error.message || "Failed to reopen ticket", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssign = async (ticketId: string, agentId: string) => {
    try {
      setIsSubmitting(true);
      const updatedTicket = await updateTicket(ticketId, {
        assigneeId: agentId,
      });
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? updatedTicket : t)),
      );
      setAssignModal({ isOpen: false, ticket: null });
      setReassignModal({ isOpen: false, ticket: null });
      toast("Ticket assigned successfully", "success");
    } catch (error: any) {
      toast(error.message || "Failed to assign ticket", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.ticket) return;
    try {
      setIsSubmitting(true);
      await deleteTicket(deleteDialog.ticket.id);
      setTickets((prev) =>
        prev.filter((t) => t.id !== deleteDialog.ticket!.id),
      );
      setDeleteDialog({ isOpen: false, ticket: null });
      toast("Ticket deleted successfully", "success");
    } catch (error: any) {
      toast(error.message || "Failed to delete ticket", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = () => {
    const csvData = [
      [
        "Ticket ID",
        "Title",
        "Category",
        "Department",
        "Priority",
        "Status",
        "Assignee",
        "Requester",
        "Created",
      ],
      ...filteredTickets.map((t) => [
        t.id,
        t.title,
        t.category?.name || "N/A",
        t.department?.name || "N/A",
        t.priority,
        t.status,
        t.assignee
          ? `${t.assignee.firstName} ${t.assignee.lastName}`
          : "Unassigned",
        t.requester
          ? `${t.requester.firstName} ${t.requester.lastName}`
          : "N/A",
        new Date(t.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "tickets-export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, { bg: string; text: string }> = {
      OPEN: { bg: "#dbeafe", text: "#1e40af" },
      IN_PROGRESS: { bg: "#fef3c7", text: "#d97706" },
      RESOLVED: { bg: "#dcfce7", text: "#15803d" },
      CLOSED: { bg: theme.backgroundTertiary, text: theme.foregroundMuted },
    };
    const statusColor = statusColors[status] || statusColors["OPEN"];
    return (
      <span
        className="px-2 py-1 text-xs font-medium rounded border"
        style={{
          backgroundColor: statusColor.bg,
          color: statusColor.text,
          fontSize: fonts.caption.small.size,
        }}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityColors: Record<string, { bg: string; text: string }> = {
      CRITICAL: { bg: "#fecaca", text: "#991b1b" },
      HIGH: { bg: "#fee2e2", text: "#dc2626" },
      MEDIUM: { bg: "#fed7aa", text: "#ea580c" },
      LOW: { bg: "#dcfce7", text: "#15803d" },
    };
    const priorityColor = priorityColors[priority] || priorityColors["MEDIUM"];
    return (
      <span
        className="px-2 py-1 text-xs font-medium rounded border"
        style={{
          backgroundColor: priorityColor.bg,
          color: priorityColor.text,
          fontSize: fonts.caption.small.size,
        }}
      >
        {priority}
      </span>
    );
  };

  const ticketColumns = [
    {
      key: "id",
      title: "Ticket ID",
      render: (value: string) => (
        <span
          className="font-mono font-medium"
          style={{ color: theme.primary, fontSize: fonts.body.sm.size }}
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
          <h3
            className="font-medium"
            style={{
              fontSize: fonts.body.regular.size,
              fontWeight: fonts.fontWeight.medium,
              color: theme.foreground,
            }}
          >
            {value}
          </h3>
          <div
            className="flex items-center space-x-3 mt-1"
            style={{
              fontSize: fonts.caption.regular.size,
              color: theme.foregroundMuted,
            }}
          >
            <span>{row.category.name}</span>
            <span>•</span>
            <span>{row.department.name}</span>
          </div>
        </div>
      ),
    },
    {
      key: "requester",
      title: "Requester",
      render: (value: any) => (
        <span style={{ fontSize: fonts.body.sm.size, color: theme.foreground }}>
          {value.firstName} {value.lastName}
        </span>
      ),
    },
    {
      key: "assignee",
      title: "Assignee",
      render: (value: any) => (
        <span
          style={{
            fontSize: fonts.body.sm.size,
            color: value ? theme.foreground : theme.foregroundMuted,
          }}
        >
          {value ? `${value.firstName} ${value.lastName}` : "Unassigned"}
        </span>
      ),
    },
    {
      key: "priority",
      title: "Priority",
      render: (value: string) => getPriorityBadge(value),
    },
    {
      key: "status",
      title: "Status",
      render: (value: string) => getStatusBadge(value),
    },
    {
      key: "createdAt",
      title: "Created",
      render: (value: string) => (
        <span
          style={{ fontSize: fonts.body.xs.size, color: theme.foregroundMuted }}
        >
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_value: any, row: any) => (
        <div className="relative">
          <button
            onClick={() =>
              setActionsMenuOpen(actionsMenuOpen === row.id ? null : row.id)
            }
            className="p-2 rounded hover:opacity-70 transition-colors"
            style={{ color: theme.foreground }}
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {/* Actions Dropdown Menu */}
          {actionsMenuOpen === row.id && (
            <>
              <div
                className="fixed inset-0 z-[9997]"
                onClick={() => setActionsMenuOpen(null)}
              />
              <div
                className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl z-[9998] py-2"
                style={{
                  backgroundColor: theme.card,
                  border: `1px solid ${theme.cardBorder}`,
                }}
              >
                <button
                  onClick={() => {
                    setViewModal({ isOpen: true, ticket: row });
                    setActionsMenuOpen(null);
                  }}
                  className="w-full px-4 py-2 text-left flex items-center hover:opacity-80 transition-colors"
                  style={{ color: "#3B82F6" }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </button>

                {!row.assignee ? (
                  <button
                    onClick={() => {
                      setAssignModal({ isOpen: true, ticket: row });
                      setActionsMenuOpen(null);
                    }}
                    className="w-full px-4 py-2 text-left flex items-center hover:opacity-80 transition-colors"
                    style={{ color: theme.primary }}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setReassignModal({ isOpen: true, ticket: row });
                      setActionsMenuOpen(null);
                    }}
                    className="w-full px-4 py-2 text-left flex items-center hover:opacity-80 transition-colors"
                    style={{ color: theme.primary }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reassign
                  </button>
                )}

                <button
                  onClick={() => {
                    setStatusModal({ isOpen: true, ticket: row });
                    setActionsMenuOpen(null);
                  }}
                  className="w-full px-4 py-2 text-left flex items-center hover:opacity-80 transition-colors"
                  style={{ color: theme.foreground }}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Change Status
                </button>

                {row.status === "CLOSED" ? (
                  <button
                    onClick={() => {
                      setReopenDialog({ isOpen: true, ticket: row });
                      setActionsMenuOpen(null);
                    }}
                    className="w-full px-4 py-2 text-left flex items-center hover:opacity-80 transition-colors"
                    style={{ color: "#F59E0B" }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reopen
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCloseDialog({ isOpen: true, ticket: row });
                      setActionsMenuOpen(null);
                    }}
                    className="w-full px-4 py-2 text-left flex items-center hover:opacity-80 transition-colors"
                    style={{ color: "#10B981" }}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Close
                  </button>
                )}

                <button
                  onClick={() => {
                    setDeleteDialog({ isOpen: true, ticket: row });
                    setActionsMenuOpen(null);
                  }}
                  className="w-full px-4 py-2 text-left flex items-center hover:opacity-80 transition-colors"
                  style={{ color: "#EF4444" }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  const filters = [
    {
      label: "Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { label: "All Status", value: "ALL" },
        { label: "Open", value: "OPEN" },
        { label: "In Progress", value: "IN_PROGRESS" },
        { label: "Resolved", value: "RESOLVED" },
        { label: "Closed", value: "CLOSED" },
      ],
    },
    {
      label: "Priority",
      value: priorityFilter,
      onChange: setPriorityFilter,
      options: [
        { label: "All Priority", value: "ALL" },
        { label: "Critical", value: "CRITICAL" },
        { label: "High", value: "HIGH" },
        { label: "Medium", value: "MEDIUM" },
        { label: "Low", value: "LOW" },
      ],
    },
    {
      label: "Department",
      value: departmentFilter,
      onChange: setDepartmentFilter,
      options: [
        { label: "All Departments", value: "ALL" },
        ...departments.map((dept) => ({ label: dept.name, value: dept.name })),
      ],
    },
    {
      label: "Category",
      value: categoryFilter,
      onChange: setCategoryFilter,
      options: [
        { label: "All Categories", value: "ALL" },
        ...categories.map((cat) => ({ label: cat.name, value: cat.name })),
      ],
    },
  ];

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "OPEN").length;
  const inProgressTickets = tickets.filter(
    (t) => t.status === "IN_PROGRESS",
  ).length;
  const unassignedTickets = tickets.filter((t) => !t.assignee).length;

  // Get agents for assignment modals
  const agentOptions = users
    .filter((user) => user.role === "AGENT")
    .map((agent) => ({
      id: agent.id,
      name: `${agent.firstName} ${agent.lastName}`,
      department: agent.department?.name || "Unknown",
    }));

  const filteredTickets = tickets.filter((ticket) => {
    const query = searchTerm.trim().toLowerCase();
    const requesterName = ticket.requester
      ? `${ticket.requester.firstName} ${ticket.requester.lastName}`.toLowerCase()
      : "";
    const matchesSearch =
      !query ||
      ticket.id.toLowerCase().includes(query) ||
      ticket.title.toLowerCase().includes(query) ||
      requesterName.includes(query);
    const matchesStatus =
      statusFilter === "ALL" || ticket.status === statusFilter;
    const matchesPriority =
      priorityFilter === "ALL" || ticket.priority === priorityFilter;
    const matchesDepartment =
      departmentFilter === "ALL" ||
      ticket.department?.name === departmentFilter;
    const matchesCategory =
      categoryFilter === "ALL" || ticket.category?.name === categoryFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesDepartment &&
      matchesCategory
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTickets.length / itemsPerPage),
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

  // Show loading state
  if (isLoadingData) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2
            className="h-8 w-8 animate-spin"
            style={{ color: theme.primary }}
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <TopBar
        title="Ticket Management"
        subtitle="View, assign, update, and manage all support tickets"
        actions={
          <div className="flex gap-2">
            <ActionButton
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={loadData}
              disabled={isLoadingData}
            >
              Refresh
            </ActionButton>
            <ActionButton
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleExport}
            >
              Export
            </ActionButton>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div
            className="animate-slideInLeft"
            style={{ animationDelay: "100ms" }}
          >
            <StatCard
              title="Total Tickets"
              value={totalTickets.toString()}
              icon={TicketIcon}
              iconColor={theme.primary}
            />
          </div>
          <div
            className="animate-slideInLeft"
            style={{ animationDelay: "200ms" }}
          >
            <StatCard
              title="Open Tickets"
              value={openTickets.toString()}
              icon={AlertTriangle}
              iconColor="#f59e0b"
            />
          </div>
          <div
            className="animate-slideInLeft"
            style={{ animationDelay: "300ms" }}
          >
            <StatCard
              title="In Progress"
              value={inProgressTickets.toString()}
              icon={Users}
              iconColor="#2FD9C4"
            />
          </div>
          <div
            className="animate-slideInLeft"
            style={{ animationDelay: "400ms" }}
          >
            <StatCard
              title="Unassigned"
              value={unassignedTickets.toString()}
              icon={AlertTriangle}
              iconColor="#dc2626"
            />
          </div>
        </div>

        <SearchFilter
          searchValue={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            handleFilterChange();
          }}
          searchPlaceholder="Search by ticket ID, title, or requester..."
          filters={filters}
        />

        <DataTable
          title={`All Tickets (${filteredTickets.length})`}
          columns={ticketColumns}
          data={paginatedTickets}
          emptyMessage="No tickets found matching your filters."
        />

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-4 py-3 rounded-lg"
            style={{
              backgroundColor: theme.card,
              border: `1px solid ${theme.cardBorder}`,
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
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </ActionButton>
              <span
                style={{
                  fontSize: fonts.body.sm.size,
                  color: theme.foreground,
                  fontWeight: fonts.fontWeight.medium,
                  padding: "0 12px",
                }}
              >
                Page {currentPage} of {totalPages}
              </span>
              <ActionButton
                variant="outline"
                size="sm"
                icon={ChevronRight}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </ActionButton>
            </div>
          </div>
        )}
      </div>

      {/* View Ticket Modal */}
      {viewModal.isOpen && viewModal.ticket && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setViewModal({ isOpen: false, ticket: null })}
          />
          <div
            className="relative rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              border: "1px solid",
            }}
          >
            <button
              onClick={() => setViewModal({ isOpen: false, ticket: null })}
              className="absolute top-4 right-4 p-1 rounded-lg transition-colors"
              style={{ color: theme.foregroundMuted }}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3
                  className="text-xl font-bold"
                  style={{ color: theme.foreground }}
                >
                  {viewModal.ticket.id}
                </h3>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(viewModal.ticket.status)}
                  {getPriorityBadge(viewModal.ticket.priority)}
                </div>
              </div>
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: theme.foreground }}
              >
                {viewModal.ticket.title}
              </h2>
              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p
                      style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundMuted,
                      }}
                    >
                      Category
                    </p>
                    <p
                      style={{
                        fontSize: fonts.body.regular.size,
                        color: theme.foreground,
                      }}
                    >
                      {viewModal.ticket.category.name}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundMuted,
                      }}
                    >
                      Department
                    </p>
                    <p
                      style={{
                        fontSize: fonts.body.regular.size,
                        color: theme.foreground,
                      }}
                    >
                      {viewModal.ticket.department.name}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundMuted,
                      }}
                    >
                      Requester
                    </p>
                    <p
                      style={{
                        fontSize: fonts.body.regular.size,
                        color: theme.foreground,
                      }}
                    >
                      {viewModal.ticket.requester.firstName}{" "}
                      {viewModal.ticket.requester.lastName}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundMuted,
                      }}
                    >
                      Assignee
                    </p>
                    <p
                      style={{
                        fontSize: fonts.body.regular.size,
                        color: theme.foreground,
                      }}
                    >
                      {viewModal.ticket.assignee
                        ? `${viewModal.ticket.assignee.firstName} ${viewModal.ticket.assignee.lastName}`
                        : "Unassigned"}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundMuted,
                      }}
                    >
                      Created
                    </p>
                    <p
                      style={{
                        fontSize: fonts.body.regular.size,
                        color: theme.foreground,
                      }}
                    >
                      {new Date(viewModal.ticket.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: fonts.body.sm.size,
                      color: theme.foregroundMuted,
                    }}
                    className="mb-2"
                  >
                    Description
                  </p>
                  <p
                    style={{
                      fontSize: fonts.body.regular.size,
                      color: theme.foreground,
                      lineHeight: "1.6",
                    }}
                  >
                    {viewModal.ticket.description}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <ActionButton
                  variant="outline"
                  size="md"
                  icon={UserPlus}
                  onClick={() => {
                    setViewModal({ isOpen: false, ticket: null });
                    setAssignModal({ isOpen: true, ticket: viewModal.ticket });
                  }}
                >
                  Assign
                </ActionButton>
                <ActionButton
                  variant="outline"
                  size="md"
                  icon={Edit2}
                  onClick={() => {
                    setViewModal({ isOpen: false, ticket: null });
                    setStatusModal({ isOpen: true, ticket: viewModal.ticket });
                  }}
                >
                  Change Status
                </ActionButton>
                <ActionButton
                  variant="outline"
                  size="md"
                  icon={Edit2}
                  onClick={() => {
                    setViewModal({ isOpen: false, ticket: null });
                    setPriorityModal({
                      isOpen: true,
                      ticket: viewModal.ticket,
                    });
                  }}
                >
                  Change Priority
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignModal.isOpen && assignModal.ticket && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setAssignModal({ isOpen: false, ticket: null })}
          />
          <div
            className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
            style={{
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              border: "1px solid",
            }}
          >
            <button
              onClick={() => setAssignModal({ isOpen: false, ticket: null })}
              className="absolute top-4 right-4 p-1 rounded-lg transition-colors hover:opacity-80"
              style={{ color: theme.foregroundMuted }}
            >
              <X className="w-5" />
            </button>
            <h3
              className="text-lg font-bold mb-2 flex items-center"
              style={{ color: theme.foreground }}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Assign Ticket {assignModal.ticket.id}
            </h3>

            {/* Check if ticket can be assigned/reassigned */}
            {assignModal.ticket.assignee &&
              assignModal.ticket.status !== "CLOSED" &&
              assignModal.ticket.status !== "RESOLVED" ? (
              <div>
                <div
                  className="mb-4 p-3 rounded-lg"
                  style={{
                    backgroundColor: theme.accent,
                    border: `1px solid ${theme.primary}`,
                  }}
                >
                  <p
                    style={{
                      fontSize: fonts.body.sm.size,
                      color: theme.foreground,
                    }}
                  >
                    <strong>Currently assigned to:</strong>{" "}
                    {assignModal.ticket.assignee.firstName}{" "}
                    {assignModal.ticket.assignee.lastName}
                  </p>
                  <p
                    style={{
                      fontSize: fonts.body.xs.size,
                      color: theme.foregroundMuted,
                      marginTop: "4px",
                    }}
                  >
                    This ticket is already assigned and active. Only closed or
                    resolved tickets can be reassigned.
                  </p>
                </div>
                <ActionButton
                  variant="outline"
                  size="md"
                  onClick={() =>
                    setAssignModal({ isOpen: false, ticket: null })
                  }
                  className="w-full"
                >
                  Close
                </ActionButton>
              </div>
            ) : (
              <>
                <p
                  style={{
                    fontSize: fonts.body.sm.size,
                    color: theme.foregroundMuted,
                    marginBottom: "8px",
                  }}
                >
                  Department:{" "}
                  <strong>
                    {assignModal.ticket.department?.name || "N/A"}
                  </strong>{" "}
                  | Category:{" "}
                  <strong>{assignModal.ticket.category?.name || "N/A"}</strong>
                </p>
                <p
                  style={{
                    fontSize: fonts.body.xs.size,
                    color: theme.foregroundMuted,
                    marginBottom: "16px",
                  }}
                >
                  {assignModal.ticket.assignee
                    ? `Previously assigned to: ${assignModal.ticket.assignee.firstName} ${assignModal.ticket.assignee.lastName}`
                    : "Select an agent from matching department"}
                </p>

                {/* Filter agents by department */}
                {(() => {
                  const matchingAgents = agentOptions.filter(
                    (agent) =>
                      agent.department === assignModal.ticket.department?.name,
                  );
                  const otherAgents = agentOptions.filter(
                    (agent) =>
                      agent.department !== assignModal.ticket.department?.name,
                  );

                  return (
                    <div className="space-y-4">
                      {matchingAgents.length > 0 && (
                        <div>
                          <p
                            style={{
                              fontSize: fonts.body.sm.size,
                              color: theme.primary,
                              fontWeight: 600,
                              marginBottom: "8px",
                            }}
                          >
                            Recommended (Same Department)
                          </p>
                          <div className="space-y-2">
                            {matchingAgents.map((agent) => (
                              <button
                                key={agent.id}
                                onClick={() =>
                                  handleAssign(assignModal.ticket.id, agent.id)
                                }
                                className="w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center justify-between hover:opacity-90"
                                style={{
                                  backgroundColor: theme.backgroundSecondary,
                                  border: `2px solid ${theme.primary}`,
                                }}
                              >
                                <div>
                                  <p
                                    className="font-medium"
                                    style={{ color: theme.foreground }}
                                  >
                                    {agent.name}
                                  </p>
                                  <p
                                    style={{
                                      fontSize: fonts.body.sm.size,
                                      color: theme.foregroundMuted,
                                    }}
                                  >
                                    {agent.department}
                                  </p>
                                </div>
                                <CheckCircle
                                  className="h-5 w-5"
                                  style={{ color: theme.primary }}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {otherAgents.length > 0 && (
                        <div>
                          <p
                            style={{
                              fontSize: fonts.body.sm.size,
                              color: theme.foregroundMuted,
                              fontWeight: 600,
                              marginBottom: "8px",
                            }}
                          >
                            Other Agents
                          </p>
                          <div className="space-y-2">
                            {otherAgents.map((agent) => (
                              <button
                                key={agent.id}
                                onClick={() =>
                                  handleAssign(assignModal.ticket.id, agent.id)
                                }
                                className="w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center justify-between hover:opacity-90"
                                style={{
                                  backgroundColor: theme.backgroundSecondary,
                                  border: "2px solid transparent",
                                }}
                              >
                                <div>
                                  <p
                                    className="font-medium"
                                    style={{ color: theme.foreground }}
                                  >
                                    {agent.name}
                                  </p>
                                  <p
                                    style={{
                                      fontSize: fonts.body.sm.size,
                                      color: theme.foregroundMuted,
                                    }}
                                  >
                                    {agent.department}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {statusModal.isOpen && statusModal.ticket && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setStatusModal({ isOpen: false, ticket: null })}
          />
          <div
            className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
            style={{
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              border: "1px solid",
            }}
          >
            <button
              onClick={() => setStatusModal({ isOpen: false, ticket: null })}
              className="absolute top-4 right-4 p-1 rounded-lg transition-colors"
              style={{ color: theme.foregroundMuted }}
            >
              <X className="w-5 h-5" />
            </button>
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: theme.foreground }}
            >
              Change Status - {statusModal.ticket.id}
            </h3>
            <div className="space-y-2">
              {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((status) => (
                <button
                  key={status}
                  onClick={() =>
                    handleStatusChange(statusModal.ticket.id, status)
                  }
                  className="w-full p-3 rounded-lg text-left transition-colors flex items-center justify-between"
                  style={{
                    backgroundColor:
                      statusModal.ticket.status === status
                        ? theme.accent
                        : theme.backgroundSecondary,
                  }}
                >
                  <span style={{ color: theme.foreground }}>
                    {status.replace("_", " ")}
                  </span>
                  {statusModal.ticket.status === status && (
                    <Check
                      className="h-4 w-4"
                      style={{ color: theme.primary }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reassign Modal */}
      {reassignModal.isOpen && reassignModal.ticket && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setReassignModal({ isOpen: false, ticket: null })}
          />
          <div
            className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
            style={{
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              border: "1px solid",
            }}
          >
            <button
              onClick={() => setReassignModal({ isOpen: false, ticket: null })}
              className="absolute top-4 right-4 p-1 rounded-lg transition-colors hover:opacity-80"
              style={{ color: theme.foregroundMuted }}
            >
              <X className="w-5 h-5" />
            </button>
            <h3
              className="text-lg font-bold mb-2 flex items-center"
              style={{ color: theme.foreground }}
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Reassign Ticket {reassignModal.ticket.id}
            </h3>
            <div
              className="mb-4 p-3 rounded-lg"
              style={{
                backgroundColor: theme.accent,
                border: `1px solid ${theme.primary}`,
              }}
            >
              <p
                style={{
                  fontSize: fonts.body.sm.size,
                  color: theme.foreground,
                }}
              >
                <strong>Currently assigned to:</strong>{" "}
                {reassignModal.ticket.assignee?.firstName}{" "}
                {reassignModal.ticket.assignee?.lastName}
              </p>
              <p
                style={{
                  fontSize: fonts.body.xs.size,
                  color: theme.foregroundMuted,
                  marginTop: "4px",
                }}
              >
                Reassign this ticket to another available agent.
              </p>
            </div>
            <p
              style={{
                fontSize: fonts.body.sm.size,
                color: theme.foregroundMuted,
                marginBottom: "16px",
              }}
            >
              Department:{" "}
              <strong>{reassignModal.ticket.department?.name || "N/A"}</strong>{" "}
              | Category:{" "}
              <strong>{reassignModal.ticket.category?.name || "N/A"}</strong>
            </p>

            {/* Filter agents by department */}
            {(() => {
              const matchingAgents = agentOptions.filter(
                (agent) =>
                  agent.department === reassignModal.ticket.department?.name &&
                  agent.name !==
                  reassignModal.ticket.assignee?.firstName +
                  " " +
                  reassignModal.ticket.assignee?.lastName,
              );
              const otherAgents = agentOptions.filter(
                (agent) =>
                  agent.department !== reassignModal.ticket.department?.name &&
                  agent.name !==
                  reassignModal.ticket.assignee?.firstName +
                  " " +
                  reassignModal.ticket.assignee?.lastName,
              );

              return (
                <div className="space-y-4">
                  {matchingAgents.length > 0 && (
                    <div>
                      <p
                        style={{
                          fontSize: fonts.body.sm.size,
                          color: theme.primary,
                          fontWeight: 600,
                          marginBottom: "8px",
                        }}
                      >
                        Recommended (Same Department)
                      </p>
                      <div className="space-y-2">
                        {matchingAgents.map((agent) => (
                          <button
                            key={agent.id}
                            onClick={() =>
                              handleAssign(reassignModal.ticket.id, agent.id)
                            }
                            className="w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center justify-between hover:opacity-90"
                            style={{
                              backgroundColor: theme.backgroundSecondary,
                              border: `2px solid ${theme.primary}`,
                            }}
                          >
                            <div>
                              <p
                                className="font-medium"
                                style={{ color: theme.foreground }}
                              >
                                {agent.name}
                              </p>
                              <p
                                style={{
                                  fontSize: fonts.body.sm.size,
                                  color: theme.foregroundMuted,
                                }}
                              >
                                {agent.department}
                              </p>
                            </div>
                            <CheckCircle
                              className="h-5 w-5"
                              style={{ color: theme.primary }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {otherAgents.length > 0 && (
                    <div>
                      <p
                        style={{
                          fontSize: fonts.body.sm.size,
                          color: theme.foregroundMuted,
                          fontWeight: 600,
                          marginBottom: "8px",
                        }}
                      >
                        Other Agents
                      </p>
                      <div className="space-y-2">
                        {otherAgents.map((agent) => (
                          <button
                            key={agent.id}
                            onClick={() =>
                              handleAssign(reassignModal.ticket.id, agent.id)
                            }
                            className="w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center justify-between hover:opacity-90"
                            style={{
                              backgroundColor: theme.backgroundSecondary,
                              border: "2px solid transparent",
                            }}
                          >
                            <div>
                              <p
                                className="font-medium"
                                style={{ color: theme.foreground }}
                              >
                                {agent.name}
                              </p>
                              <p
                                style={{
                                  fontSize: fonts.body.sm.size,
                                  color: theme.foregroundMuted,
                                }}
                              >
                                {agent.department}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchingAgents.length === 0 && otherAgents.length === 0 && (
                    <p
                      style={{
                        fontSize: fonts.body.sm.size,
                        color: theme.foregroundMuted,
                        textAlign: "center",
                        padding: "16px",
                      }}
                    >
                      No other agents available for reassignment.
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Priority Change Modal */}
      {priorityModal.isOpen && priorityModal.ticket && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setPriorityModal({ isOpen: false, ticket: null })}
          />
          <div
            className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
            style={{
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
              border: "1px solid",
            }}
          >
            <button
              onClick={() => setPriorityModal({ isOpen: false, ticket: null })}
              className="absolute top-4 right-4 p-1 rounded-lg transition-colors"
              style={{ color: theme.foregroundMuted }}
            >
              <X className="w-5 h-5" />
            </button>
            <h3
              className="text-lg font-bold mb-4"
              style={{ color: theme.foreground }}
            >
              Change Priority - {priorityModal.ticket.id}
            </h3>
            <div className="space-y-2">
              {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((priority) => (
                <button
                  key={priority}
                  onClick={() =>
                    handlePriorityChange(priorityModal.ticket.id, priority)
                  }
                  className="w-full p-3 rounded-lg text-left transition-colors flex items-center justify-between"
                  style={{
                    backgroundColor:
                      priorityModal.ticket.priority === priority
                        ? theme.accent
                        : theme.backgroundSecondary,
                  }}
                >
                  <span style={{ color: theme.foreground }}>{priority}</span>
                  {priorityModal.ticket.priority === priority && (
                    <Check
                      className="h-4 w-4"
                      style={{ color: theme.primary }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, ticket: null })}
        onConfirm={handleDelete}
        variant="danger"
        title="Delete Ticket"
        message={`Are you sure you want to delete ticket "${deleteDialog.ticket?.id}"? This action cannot be undone.`}
        confirmLabel="Delete Ticket"
      />

      <ConfirmationDialog
        isOpen={closeDialog.isOpen}
        onClose={() => setCloseDialog({ isOpen: false, ticket: null })}
        onConfirm={handleClose}
        variant="warning"
        title="Close Ticket"
        message={`Are you sure you want to close ticket "${closeDialog.ticket?.id}"? You can reopen it later if needed.`}
        confirmLabel="Close Ticket"
      />

      <ConfirmationDialog
        isOpen={reopenDialog.isOpen}
        onClose={() => setReopenDialog({ isOpen: false, ticket: null })}
        onConfirm={handleReopen}
        variant="default"
        title="Reopen Ticket"
        message={`Reopen ticket "${reopenDialog.ticket?.id}" and set status back to OPEN?`}
        confirmLabel="Reopen Ticket"
      />
    </PageLayout>
  );
}
