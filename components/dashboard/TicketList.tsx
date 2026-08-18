'use client';

import { Ticket as TicketIcon } from 'lucide-react';
import { TicketCard } from '@/components/dashboard/TicketCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { BODY_TEXT_GREY, PRIMARY_TEXT } from '@/lib/colors';
import { BODY_SM, FONT_FAMILY, HEADING_SM } from '@/lib/fonts';
import type { Ticket } from '@/types/ticket';

interface TicketListProps {
  tickets: Ticket[];
  loading?: boolean;
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function TicketList({
  tickets,
  loading = false,
  title = 'Assigned Tickets',
  description = 'Tickets currently assigned to you, sorted by latest activity.',
  emptyTitle = 'No tickets found',
  emptyDescription = 'There are no tickets matching your current filters.',
}: TicketListProps) {
  return (
    <section className="space-y-4">
      <div>
        <h2
          style={{
            color: PRIMARY_TEXT,
            fontFamily: FONT_FAMILY.primary,
            fontSize: HEADING_SM.size,
            fontWeight: HEADING_SM.weight,
          }}
        >
          {title}
        </h2>
        <p
          className="mt-1"
          style={{
            color: BODY_TEXT_GREY,
            fontFamily: FONT_FAMILY.primary,
            fontSize: BODY_SM.size,
          }}
        >
          {description}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8" />
        </div>
      ) : tickets.length === 0 ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          icon={<TicketIcon size={28} />}
        />
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </section>
  );
}
