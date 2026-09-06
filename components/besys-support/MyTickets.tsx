"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MyTicketsHeaderSection } from "./MyTickets/MyTicketsHeaderSection";
import { TicketsSection } from "./MyTickets/TicketsSection";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useEmployeeProfile } from "@/lib/hooks/useEmployeeProfile";
import type { TicketStatus } from "@/lib/types/ticket";
import { getEmployeeTicketPage, type EmployeeTicket } from "@/lib/api/employee";
import { transformTicketForTable } from "@/lib/utils/transform-ticket-data";

export function MyTickets() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [tickets, setTickets] = useState<EmployeeTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalTickets, setTotalTickets] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "All">("All");
  const { profile } = useEmployeeProfile();

  useEffect(() => {
    loadTickets();
  }, [currentPage, debouncedSearchQuery, statusFilter]);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const result = await getEmployeeTicketPage(
        currentPage,
        5,
        statusFilter === "All" ? undefined : statusFilter,
        debouncedSearchQuery,
      );
      setTickets(result.data);
      setTotalTickets(result.pagination.total);
    } catch (error) {
      console.error("Failed to load tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const pageTickets = tickets.map((ticket) => transformTicketForTable(ticket));

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
        paginatedTickets={pageTickets}
        filteredTickets={pageTickets}
        totalItems={totalTickets}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        currentPage={currentPage}
        itemsPerPage={5}
        onRowClick={handleRowClick}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setCurrentPage(1);
        }}
        onStatusFilterChange={(value: TicketStatus | "All") => {
          setStatusFilter(value);
          setCurrentPage(1);
        }}
        onClearSearch={handleClearSearch}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
        onRefresh={loadTickets}
      />
    </DashboardLayout>
  );
}
