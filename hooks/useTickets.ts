'use client';

import { useCallback, useEffect, useState } from 'react';
import { mapApiTicket } from '@/lib/ticketMapper';
import { useAuth } from '@/hooks/useAuth';
import type { Ticket } from '@/types/ticket';

type UseTicketsOptions = {
  assignedOnly?: boolean;
  autoFetch?: boolean;
};

type UseTicketsResult = {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useTickets(options: UseTicketsOptions = {}): UseTicketsResult {
  const { assignedOnly = false, autoFetch = true } = options;
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tickets');
      if (!response.ok) {
        throw new Error('Failed to load tickets');
      }

      const data = await response.json();
      let mapped = (Array.isArray(data) ? data : []).map(mapApiTicket);

      if (assignedOnly && user?.id) {
        mapped = mapped.filter((ticket) => ticket.assigneeId === user.id);
      }

      setTickets(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, [assignedOnly, user?.id]);

  useEffect(() => {
    if (autoFetch) {
      void refresh();
    }
  }, [autoFetch, refresh]);

  return { tickets, loading, error, refresh };
}
