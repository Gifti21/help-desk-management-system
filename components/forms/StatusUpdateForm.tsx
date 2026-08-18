'use client';

import { useState } from 'react';
import { TICKET_STATUSES, TICKET_STATUS_LABELS } from '@/constants/ticketStatuses';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BODY_TEXT_GREY, PRIMARY_TEXT } from '@/lib/colors';
import { BODY_SM, FONT_FAMILY, HEADING_SM } from '@/lib/fonts';
import type { TicketStatus } from '@/types/ticket';

interface StatusUpdateFormProps {
  currentStatus: TicketStatus;
  disabled?: boolean;
  loading?: boolean;
  onSubmit: (status: TicketStatus) => Promise<void> | void;
}

export function StatusUpdateForm({
  currentStatus,
  disabled = false,
  loading = false,
  onSubmit,
}: StatusUpdateFormProps) {
  const [status, setStatus] = useState<TicketStatus>(currentStatus);
  const isClosed = currentStatus === 'CLOSED';

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <h2
            style={{
              color: PRIMARY_TEXT,
              fontFamily: FONT_FAMILY.primary,
              fontSize: HEADING_SM.size,
              fontWeight: HEADING_SM.weight,
            }}
          >
            Update Status
          </h2>
          <p style={{ color: BODY_TEXT_GREY, fontSize: BODY_SM.size }}>
            Only the assigned support agent can change ticket status.
          </p>
        </div>

        <select
          value={status}
          disabled={disabled || isClosed || loading}
          onChange={(event) => setStatus(event.target.value as TicketStatus)}
          className="w-full rounded-xl border px-4 py-3 outline-none disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            borderColor: '#E3ECE8',
            backgroundColor: '#FFFFFF',
            color: PRIMARY_TEXT,
            fontFamily: FONT_FAMILY.primary,
            fontSize: BODY_SM.size,
          }}
        >
          {TICKET_STATUSES.map((option) => (
            <option key={option} value={option}>
              {TICKET_STATUS_LABELS[option]}
            </option>
          ))}
        </select>

        <div className="flex justify-end">
          <Button
            loading={loading}
            disabled={disabled || isClosed || status === currentStatus}
            onClick={() => void onSubmit(status)}
          >
            Save Status
          </Button>
        </div>
      </div>
    </Card>
  );
}
