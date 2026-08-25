import React from 'react';
import { Search } from "lucide-react";
import { BODY_TEXT_GREY, PRIMARY_TEXT } from '@/lib/colors';
import { BODY_SM, FONT_FAMILY, HEADING_SM, FONT_WEIGHT } from '@/lib/fonts';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description = "Try adjusting your search or filter criteria",
  icon = <Search className="h-12 w-12 opacity-50" />,
  action
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center"
      style={{ borderColor: '#E3ECE8', backgroundColor: '#F7F9F8' }}
    >
      {icon ? <div className="mb-4 text-[#2FD9C4]">{icon}</div> : null}
      <p
        style={{
          color: PRIMARY_TEXT,
          fontFamily: FONT_FAMILY.primary,
          fontSize: HEADING_SM.size,
          fontWeight: HEADING_SM.weight,
        }}
      >
        {title}
      </p>
      {description && (
        <p
          className="mt-2 max-w-md"
          style={{
            color: BODY_TEXT_GREY,
            fontFamily: FONT_FAMILY.primary,
            fontSize: BODY_SM.size,
          }}
        >
          {description}
        </p>
      )}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}