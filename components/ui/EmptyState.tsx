import React from 'react';
import { BODY_TEXT_GREY, PRIMARY_TEXT } from '@/lib/colors';
import { BODY_SM, FONT_FAMILY, HEADING_SM } from '@/lib/fonts';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => (
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
    {action ? <div className="mt-5">{action}</div> : null}
  </div>
);
