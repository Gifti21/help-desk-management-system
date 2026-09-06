import { DARK_GREEN, BORDER_GREY } from "@/lib/colors";
import { HEADING_LG, FONT_FAMILY } from "@/lib/fonts";
import { Card } from "@/components/ui/card";
import { TicketTable } from "@/components/ui/TicketTable";
import { TicketPagination } from "@/components/ui/TicketPagination";
import { TicketSearchFilter } from "@/components/ui/TicketSearchFilter";
import { EmptyState } from "@/components/ui/EmptyState";
import { statusColors, priorityColors } from "@/lib/utils/ticket-colors";
import type { TicketStatus } from "@/lib/types/ticket";
import type { TicketTableRow } from "@/lib/types/ticket";

interface TicketsSectionProps {
  paginatedTickets: TicketTableRow[];
  filteredTickets: TicketTableRow[];
  totalItems?: number;
  searchQuery: string;
  statusFilter: TicketStatus | "All";
  currentPage: number;
  itemsPerPage: number;
  onRowClick: (ticketId: string) => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: TicketStatus | "All") => void;
  onClearSearch: () => void;
  onPageChange: (page: number) => void;
}

export function TicketsSection({
  paginatedTickets,
  filteredTickets,
  totalItems,
  searchQuery,
  statusFilter,
  currentPage,
  itemsPerPage,
  onRowClick,
  onSearchChange,
  onStatusFilterChange,
  onClearSearch,
  onPageChange,
}: TicketsSectionProps) {
  return (
    <Card
      variant="elevated"
      className="p-6"
      style={{ borderColor: BORDER_GREY }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: HEADING_LG.size,
            lineHeight: HEADING_LG.lineHeight,
            fontWeight: HEADING_LG.weight,
            letterSpacing: HEADING_LG.letterSpacing,
            color: DARK_GREEN,
          }}
        >
          All Tickets
        </h2>

        <TicketSearchFilter
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={onSearchChange}
          onStatusFilterChange={onStatusFilterChange}
          onClearSearch={onClearSearch}
          onPageReset={() => onPageChange(1)}
        />
      </div>

      {paginatedTickets.length > 0 ? (
        <TicketTable
          tickets={paginatedTickets}
          onRowClick={onRowClick}
          statusColors={statusColors}
          priorityColors={priorityColors}
        />
      ) : (
        <EmptyState title="No tickets match your search" />
      )}

      <TicketPagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems ?? filteredTickets.length}
        onPageChange={onPageChange}
      />
    </Card>
  );
}
