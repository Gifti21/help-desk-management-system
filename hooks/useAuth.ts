'use client';

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import type { Ticket } from '@/types/ticket';
import type { User, UserRole } from '@/types/user';

type UseAuthResult = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole | null;
  isAgent: boolean;
  isAssignedAgent: (ticket: Pick<Ticket, 'assigneeId'>) => boolean;
  canManageTicket: (ticket: Pick<Ticket, 'assigneeId' | 'status'>) => boolean;
};

export function useAuth(): UseAuthResult {
  const { data: session, status } = useSession();

  const user = useMemo<User | null>(() => {
    if (!session?.user?.id) return null;
    return {
      id: session.user.id,
      name: session.user.name ?? 'Agent',
      email: session.user.email ?? '',
      role: session.user.role,
      departmentId: session.user.departmentId,
    };
  }, [session]);

  const isAssignedAgent = (ticket: Pick<Ticket, 'assigneeId'>) => {
    if (!user?.id || !ticket.assigneeId) return false;
    return ticket.assigneeId === user.id;
  };

  const canManageTicket = (ticket: Pick<Ticket, 'assigneeId' | 'status'>) => {
    return isAssignedAgent(ticket) && ticket.status !== 'CLOSED';
  };

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: Boolean(user),
    role: user?.role ?? null,
    isAgent: user?.role === 'AGENT',
    isAssignedAgent,
    canManageTicket,
  };
}
