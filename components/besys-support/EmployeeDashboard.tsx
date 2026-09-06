"use client";

import { useMemo, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeaderSection } from "./EmployeeDashboard/DashboardHeaderSection";
import { StatCards } from "./EmployeeDashboard/StatCards";
import { RecentTickets } from "./EmployeeDashboard/RecentTickets";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useTicketPagination } from "@/lib/hooks/useTicketPagination";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useEmployeeProfile } from "@/lib/hooks/useEmployeeProfile";
import type { TicketStatus } from "@/lib/types/ticket";
import { getEmployeeDashboard, type EmployeeDashboardData, type EmployeeTicket } from "@/lib/api/employee";
import { getSessionUser } from "@/lib/session";
import { transformTicketForTable } from "@/lib/utils/transform-ticket-data";

export function EmployeeDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<EmployeeDashboardData | null>(null);
  const { profile } = useEmployeeProfile();

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const data = await getEmployeeDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    currentPage,
    setCurrentPage,
    filteredTickets,
    paginatedTickets,
    statusFilter,
    setStatusFilter,
  } = useTicketPagination({
    tickets: dashboardData?.recentTickets.map(ticket => transformTicketForTable(ticket)) || [],
    itemsPerPage: 5,
    searchQuery: debouncedSearchQuery,
  });

  const stats = useMemo(() => {
    if (!dashboardData) {
      return {
        total: 0,
        open: 0,
        inProgress: 0,
        closed: 0,
      };
    }
    return dashboardData.stats;
  }, [dashboardData]);

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
      userName={profile.fullName}
      userInitials={profile.initials}
      onSearch={handleHeaderSearch}
      searchValue={searchQuery}
      role="EMPLOYEE"
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
        onStatusFilterChange={(value: TicketStatus | "All") =>
          setStatusFilter(value)
        }
        onClearSearch={handleClearSearch}
        onPageChange={setCurrentPage}
      />
    </DashboardLayout>
  );
}
