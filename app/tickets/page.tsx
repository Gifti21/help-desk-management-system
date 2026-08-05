'use client';

import { useMemo } from 'react';
import { TicketList } from '@/components/dashboard/TicketList';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { TICKET_STATUSES, TICKET_STATUS_LABELS } from '@/constants/ticketStatuses';
import { PRIORITIES, PRIORITY_LABELS } from '@/constants/priorities';
import { useAuth } from '@/hooks/useAuth';
import { usePagination } from '@/hooks/usePagination';
import { useTicketFilters } from '@/hooks/useTicketFilters';
import { useTickets } from '@/hooks/useTickets';
import { BODY_TEXT_GREY, PAGE_BACKGROUND, PRIMARY_TEXT } from '@/lib/colors';
import { FONT_FAMILY, HEADING_LG, BODY_SM } from '@/lib/fonts';

export default function TicketsPage() {
  const { user } = useAuth();
  const { tickets, loading, refresh } = useTickets({ assignedOnly: true });
  const {
    search,
    setSearch,
    status,
    setStatus,
    priority,
    setPriority,
    assigned,
    setAssigned,
    filteredTickets,
    resetFilters,
    activeFilterCount,
  } = useTicketFilters(tickets, { currentUserId: user?.id });

  const pagination = usePagination({ totalItems: filteredTickets.length, pageSize: 5 });
  const visibleTickets = useMemo(
    () => pagination.paginate(filteredTickets),
    [filteredTickets, pagination]
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_BACKGROUND, fontFamily: FONT_FAMILY.primary }}>
      <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 style={{ color: PRIMARY_TEXT, fontSize: HEADING_LG.size, fontWeight: HEADING_LG.weight }}>
            Assigned Tickets
          </h1>
          <p style={{ color: BODY_TEXT_GREY, fontSize: BODY_SM.size }}>
            Search, filter, and open tickets assigned to you.
          </p>
        </div>

        <div className="mb-6 grid gap-4 rounded-2xl border p-4 sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: '#E3ECE8', backgroundColor: '#FFFFFF' }}>
          <Input
            label="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, requester, or ID"
          />

          <div className="space-y-1.5">
            <label htmlFor="status-filter" style={{ color: BODY_TEXT_GREY, fontSize: BODY_SM.size }}>
              Status
            </label>
            <select
              id="status-filter"
              value={status}
              onChange={(event) => setStatus(event.target.value as typeof status)}
              className="w-full rounded-xl border px-4 py-3"
              style={{ borderColor: '#E3ECE8' }}
            >
              <option value="">All statuses</option>
              {TICKET_STATUSES.map((option) => (
                <option key={option} value={option}>
                  {TICKET_STATUS_LABELS[option]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="priority-filter" style={{ color: BODY_TEXT_GREY, fontSize: BODY_SM.size }}>
              Priority
            </label>
            <select
              id="priority-filter"
              value={priority}
              onChange={(event) => setPriority(event.target.value as typeof priority)}
              className="w-full rounded-xl border px-4 py-3"
              style={{ borderColor: '#E3ECE8' }}
            >
              <option value="">All priorities</option>
              {PRIORITIES.map((option) => (
                <option key={option} value={option}>
                  {PRIORITY_LABELS[option]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="assigned-filter" style={{ color: BODY_TEXT_GREY, fontSize: BODY_SM.size }}>
              Assignment
            </label>
            <select
              id="assigned-filter"
              value={assigned}
              onChange={(event) => setAssigned(event.target.value as typeof assigned)}
              className="w-full rounded-xl border px-4 py-3"
              style={{ borderColor: '#E3ECE8' }}
            >
              <option value="all">All</option>
              <option value="me">Assigned to me</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p style={{ color: BODY_TEXT_GREY, fontSize: BODY_SM.size }}>
            {filteredTickets.length} ticket{filteredTickets.length === 1 ? '' : 's'}
            {activeFilterCount > 0 ? ` · ${activeFilterCount} filter${activeFilterCount === 1 ? '' : 's'} active` : ''}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={resetFilters}>
              Reset Filters
            </Button>
            <Button variant="secondary" onClick={() => void refresh()}>
              Refresh
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-10 w-10" />
          </div>
        ) : (
          <>
            <TicketList tickets={visibleTickets} />

            {filteredTickets.length > pagination.pageSize ? (
              <div className="mt-6 flex items-center justify-between">
                <p style={{ color: BODY_TEXT_GREY, fontSize: BODY_SM.size }}>
                  Showing {pagination.startIndex + 1}-{pagination.endIndex} of {pagination.totalItems}
                </p>
                <div className="flex gap-2">
                  <Button variant="secondary" disabled={!pagination.hasPrevious} onClick={pagination.previousPage}>
                    Previous
                  </Button>
                  <Button variant="secondary" disabled={!pagination.hasNext} onClick={pagination.nextPage}>
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
