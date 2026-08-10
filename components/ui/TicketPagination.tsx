import { ChevronLeft, ChevronRight } from "lucide-react";
import { DARK_GREEN, TEAL_PRIMARY, BORDER_GREY, BODY_TEXT_GREY, SECONDARY_BACKGROUND } from "@/lib/colors";
import { BODY_SM, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";

interface TicketPaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function TicketPagination({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}: TicketPaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
      <p
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: BODY_SM.size,
          lineHeight: BODY_SM.lineHeight,
          fontWeight: FONT_WEIGHT.medium,
          letterSpacing: BODY_SM.letterSpacing,
          color: BODY_TEXT_GREY,
        }}
      >
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} tickets
      </p>
      <div className="flex gap-2">
        <PaginationButton
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          icon={<ChevronLeft className="h-4 w-4" />}
        />
        <PaginationButton
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          icon={<ChevronRight className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}

interface PaginationButtonProps {
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
}

function PaginationButton({ onClick, disabled, icon }: PaginationButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center w-9 h-9 rounded-lg border transition focus-visible:outline-none focus-visible:ring-2"
      style={{
        borderColor: BORDER_GREY,
        backgroundColor: SECONDARY_BACKGROUND,
        color: disabled ? BODY_TEXT_GREY : DARK_GREEN,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        '--tw-ring-color': TEAL_PRIMARY,
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = BORDER_GREY;
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = SECONDARY_BACKGROUND;
      }}
    >
      {icon}
    </button>
  );
}
