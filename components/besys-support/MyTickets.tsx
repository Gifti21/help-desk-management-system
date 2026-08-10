"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MyTicketsHeaderSection } from "./MyTickets/MyTicketsHeaderSection";
import { TicketsSection } from "./MyTickets/TicketsSection";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useTicketPagination } from "@/lib/hooks/useTicketPagination";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { TicketStatus } from "@/lib/types/ticket";
import { mockTicketRows } from "@/lib/mock-data/tickets";

const mockTickets = mockTicketRows;

export function MyTickets() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

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
        onStatusFilterChange={(value: TicketStatus | "All") => setStatusFilter(value)}
        onClearSearch={handleClearSearch}
        onPageChange={setCurrentPage}
      />
    </DashboardLayout>
  );
}
