"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MyTicketsHeaderSection } from "./MyTickets/MyTicketsHeaderSection";
import { TicketsSection } from "./MyTickets/TicketsSection";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useTicketPagination } from "@/lib/hooks/useTicketPagination";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useEmployeeProfile } from "@/lib/hooks/useEmployeeProfile";
import type { TicketStatus } from "@/lib/types/ticket";
import { getEmployeeTickets, type EmployeeTicket } from "@/lib/api/employee";
import { transformTicketForTable } from "@/lib/utils/transform-ticket-data";

export function MyTickets() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [tickets, setTickets] = useState<EmployeeTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useEmployeeProfile();

  // Load tickets on mount
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const data = await getEmployeeTickets();
      setTickets(data);
    } catch (error) {
      console.error('Failed to load tickets:', error);
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
    tickets: tickets.map(ticket => transformTicketForTable(ticket)),
    itemsPerPage: 5,
    searchQuery: debouncedSearchQuery,
  });

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
      <MyTicketsHeaderSection />

      {/* Tickets Section */}
      <TicketsSection
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
        isLoading={isLoading}
        onRefresh={loadTickets}
      />
    </DashboardLayout>
  );
}
