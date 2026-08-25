import { Search, X } from "lucide-react";
import { TEAL_PRIMARY, BODY_TEXT_GREY, SECONDARY_BACKGROUND } from "@/lib/colors";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/Select";
import type { TicketStatus } from "@/lib/types/ticket";

interface TicketSearchFilterProps {
  searchQuery: string;
  statusFilter: TicketStatus | "All";
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: TicketStatus | "All") => void;
  onClearSearch: () => void;
  onPageReset: () => void;
}

export function TicketSearchFilter({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onClearSearch,
  onPageReset,
}: TicketSearchFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative w-full sm:w-64">
        <Input
          icon={Search}
          iconPosition="left"
          placeholder="Search tickets..."
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            onPageReset();
          }}
          className="w-full"
          style={{ paddingRight: searchQuery ? "36px" : undefined }}
        />
        {searchQuery && (
          <ClearButton onClick={onClearSearch} />
        )}
      </div>
      <Select
        value={statusFilter}
        onChange={(e) => {
          onStatusFilterChange(e.target.value as TicketStatus | "All");
          onPageReset();
        }}
        className="w-full sm:w-40"
      >
        <option value="All">All Status</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Resolved">Resolved</option>
        <option value="Closed">Closed</option>
      </Select>
    </div>
  );
}

function ClearButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition focus-visible:outline-none focus-visible:ring-2"
      style={{ color: BODY_TEXT_GREY, '--tw-ring-color': TEAL_PRIMARY } as React.CSSProperties}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = SECONDARY_BACKGROUND}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
    >
      <X className="h-4 w-4" />
    </button>
  );
}
