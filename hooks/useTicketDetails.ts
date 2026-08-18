'use client';

import { useCallback, useEffect, useState } from 'react';
import { mapApiTicket } from '@/lib/ticketMapper';
import type { Ticket, TicketPriority, TicketStatus } from '@/types/ticket';

type UseTicketDetailsResult = {
  ticket: Ticket | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateStatus: (status: TicketStatus) => Promise<boolean>;
  closeTicket: () => Promise<boolean>;
  updatePriority: (priority: TicketPriority) => Promise<boolean>;
};

export function useTicketDetails(ticketId: string): UseTicketDetailsResult {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!ticketId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tickets/${ticketId}`);
      if (!response.ok) {
        throw new Error('Failed to load ticket');
      }

      const data = await response.json();
      setTicket(mapApiTicket(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ticket');
      setTicket(null);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  const patchTicket = useCallback(
    async (payload: Partial<{ status: TicketStatus; priority: TicketPriority }>) => {
      if (!ticketId) return false;

      try {
        const response = await fetch(`/api/tickets/${ticketId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to update ticket');
        }

        const data = await response.json();
        setTicket(mapApiTicket(data));
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update ticket');
        return false;
      }
    },
    [ticketId]
  );

  const updateStatus = useCallback(
    async (status: TicketStatus) => patchTicket({ status }),
    [patchTicket]
  );

  const closeTicket = useCallback(async () => patchTicket({ status: 'CLOSED' }), [patchTicket]);

  const updatePriority = useCallback(
    async (priority: TicketPriority) => patchTicket({ priority }),
    [patchTicket]
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    ticket,
    loading,
    error,
    refresh,
    updateStatus,
    closeTicket,
    updatePriority,
  };
}
