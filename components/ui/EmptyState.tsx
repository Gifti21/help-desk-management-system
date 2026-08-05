import { Search } from "lucide-react";
import { BODY_TEXT_GREY } from "@/lib/colors";
import { BODY_SM, FONT_FAMILY, FONT_WEIGHT } from "@/lib/fonts";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title, 
  description = "Try adjusting your search or filter criteria",
  icon = <Search className="h-12 w-12 opacity-50" />
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12"
      style={{ color: BODY_TEXT_GREY }}
    >
      <div className="mb-4">{icon}</div>
      <p
        style={{
          fontFamily: FONT_FAMILY.primary,
          fontSize: BODY_SM.size,
          fontWeight: FONT_WEIGHT.medium,
        }}
      >
        {title}
      </p>
      {description && (
        <p
          className="mt-1 text-sm"
          style={{
            fontFamily: FONT_FAMILY.primary,
            fontSize: BODY_SM.size,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
