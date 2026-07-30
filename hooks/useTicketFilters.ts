'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Ticket, TicketPriority, TicketSortField, TicketStatus } from '@/types/ticket';
import { PRIORITIES } from '@/constants/priorities';

type SortDirection = 'asc' | 'desc';

type UseTicketFiltersResult = {
  search: string;
  setSearch: (value: string) => void;
  status: TicketStatus | '';
  setStatus: (value: TicketStatus | '') => void;
  priority: TicketPriority | '';
  setPriority: (value: TicketPriority | '') => void;
  assigned: 'all' | 'me' | 'unassigned';
  setAssigned: (value: 'all' | 'me' | 'unassigned') => void;
  activeFilterCount: number;
  filteredTickets: Ticket[];
  resetFilters: () => void;
  sortField: TicketSortField;
  sortDirection: SortDirection;
  onSortChange: (field: TicketSortField) => void;
};

const priorityWeight: Record<TicketPriority, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

type UseTicketFiltersOptions = {
  currentUserId?: string;
};

export function useTicketFilters(
  tickets: Ticket[],
  options: UseTicketFiltersOptions = {}
): UseTicketFiltersResult {
  const { currentUserId } = options;
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TicketStatus | ''>('');
  const [priority, setPriority] = useState<TicketPriority | ''>('');
  const [assigned, setAssigned] = useState<'all' | 'me' | 'unassigned'>('all');
  const [sortField, setSortField] = useState<TicketSortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const resetFilters = useCallback(() => {
    setSearch('');
    setStatus('');
    setPriority('');
    setAssigned('all');
  }, []);

  const onSortChange = useCallback((field: TicketSortField) => {
    setSortField((currentField: TicketSortField) => {
      if (currentField === field) {
        setSortDirection((currentDirection) => (currentDirection === 'asc' ? 'desc' : 'asc'));
        return currentField;
      }
      setSortDirection('desc');
      return field;
    });
  }, []);

  const activeFilterCount = useMemo(() => {
    return [search, status, priority, assigned !== 'all' ? assigned : ''].filter(Boolean).length;
  }, [assigned, priority, search, status]);

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = tickets.filter((ticket) => {
      const requesterName = ticket.creatorName
        ? ticket.creatorName.toLowerCase()
        : ticket.requester
        ? `${ticket.requester.firstName} ${ticket.requester.lastName}`.toLowerCase()
        : '';

      const deptStr = typeof ticket.department === 'object' && ticket.department
        ? ticket.department.name.toLowerCase()
        : (ticket.department || ticket.category || '').toString().toLowerCase();

      const ticketNum = (ticket.ticketNumber || ticket.id).toLowerCase();

      const matchesSearch =
        !query ||
        ticket.id.toLowerCase().includes(query) ||
        ticketNum.includes(query) ||
        ticket.title.toLowerCase().includes(query) ||
        requesterName.includes(query) ||
        deptStr.includes(query);

      const matchesStatus = !status || ticket.status === status;
      const matchesPriority = !priority || ticket.priority === priority;

      const matchesAssigned =
        assigned === 'all' ||
        (assigned === 'me' && currentUserId && ticket.assigneeId === currentUserId) ||
        (assigned === 'unassigned' && !ticket.assigneeId);

      return matchesSearch && matchesStatus && matchesPriority && matchesAssigned;
    });

    result = [...result].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'priority':
          comparison = priorityWeight[a.priority] - priorityWeight[b.priority];
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        default:
          comparison = String(a.id).localeCompare(String(b.id));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [assigned, currentUserId, priority, search, sortDirection, sortField, status, tickets]);

  return {
    search,
    setSearch,
    status,
    setStatus,
    priority,
    setPriority,
    assigned,
    setAssigned,
    activeFilterCount,
    filteredTickets,
    resetFilters,
    sortField,
    sortDirection,
    onSortChange,
  };
}

export { PRIORITIES };
