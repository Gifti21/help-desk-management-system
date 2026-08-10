"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeaderSection } from "./EmployeeDashboard/DashboardHeaderSection";
import { StatCards } from "./EmployeeDashboard/StatCards";
import { RecentTickets } from "./EmployeeDashboard/RecentTickets";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useTicketPagination } from "@/lib/hooks/useTicketPagination";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { TicketStatus } from "@/lib/types/ticket";
import { mockTicketRows } from "@/lib/mock-data/tickets";

const mockTickets = mockTicketRows;

export function EmployeeDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isLoading] = useState(false);

  const {
    currentPage,
    setCurrentPage,
    filteredTickets,
    paginatedTickets,
    statusFilter,
    setStatusFilter,
  } = useTicketPagination({
    tickets: mockTickets,
    itemsPerPage: 5,
    searchQuery: debouncedSearchQuery,
  });

  const stats = useMemo(() => {
    return {
      total: mockTickets.length,
      open: mockTickets.filter((t) => t.status === "Open").length,
      inProgress: mockTickets.filter((t) => t.status === "In Progress").length,
      closed: mockTickets.filter((t) => t.status === "Closed").length,
    };
  }, []);

  const handleRowClick = (ticketId: string) => {
    router.push(`/employee/tickets/${ticketId}`);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleHeaderSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <DashboardLayout
      userName="Jamie Smith"
      userInitials="JS"
      onSearch={handleHeaderSearch}
      searchValue={searchQuery}
    >
      <DashboardHeaderSection />
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCards stats={stats} isLoading={isLoading} />
      </div>

      {/* Recent Tickets Section */}
      <RecentTickets
        paginatedTickets={paginatedTickets}
        filteredTickets={filteredTickets}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        currentPage={currentPage}
        itemsPerPage={5}
        onRowClick={handleRowClick}
        onSearchChange={setSearchQuery}
        onStatusFilterChange={(value: TicketStatus | "All") => setStatusFilter(value)}
        onClearSearch={handleClearSearch}
        onPageChange={setCurrentPage}
      />
    </DashboardLayout>
  );
}
