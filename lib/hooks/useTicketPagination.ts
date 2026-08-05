import { useState, useMemo } from "react";
import type { TicketStatus, TicketTableRow } from "@/lib/types/ticket";

interface UseTicketPaginationOptions {
  tickets: TicketTableRow[];
  itemsPerPage?: number;
  searchQuery?: string;
}

interface UseTicketPaginationReturn {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  filteredTickets: TicketTableRow[];
  paginatedTickets: TicketTableRow[];
  totalPages: number;
  statusFilter: TicketStatus | "All";
  setStatusFilter: (filter: TicketStatus | "All") => void;
}

export function useTicketPagination({
  tickets,
  itemsPerPage = 5,
  searchQuery = "",
}: UseTicketPaginationOptions): UseTicketPaginationReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "All">("All");

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, tickets]);

  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTickets, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  return {
    currentPage,
    setCurrentPage,
    filteredTickets,
    paginatedTickets,
    totalPages,
    statusFilter,
    setStatusFilter,
  };
}
