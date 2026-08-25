"use client";

import { useState } from "react";
import { Lock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/Modal";
import { BODY_TEXT_GREY, PRIMARY_TEXT } from "@/lib/colors";
import { BODY_SM, FONT_FAMILY, HEADING_SM } from "@/lib/fonts";

interface TicketActionBarProps {
  canManage: boolean;
  isClosed: boolean;
  closing?: boolean;
  onCloseTicket: () => Promise<void> | void;
}

export function TicketActionBar({
  canManage,
  isClosed,
  closing = false,
  onCloseTicket,
}: TicketActionBarProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              style={{
                color: PRIMARY_TEXT,
                fontFamily: FONT_FAMILY.primary,
                fontSize: HEADING_SM.size,
                fontWeight: HEADING_SM.weight,
              }}
            >
              Ticket Actions
            </h2>
            <p style={{ color: BODY_TEXT_GREY, fontSize: BODY_SM.size }}>
              {canManage
                ? "Close the ticket when the issue has been resolved."
                : "Only the assigned support agent can close this ticket."}
            </p>
          </div>

          {!canManage ? (
            <div
              className="inline-flex items-center gap-2 rounded-xl px-4 py-3"
              style={{ backgroundColor: "#E5F9F6", color: "#16332B" }}
            >
              <Lock size={16} />
              <span style={{ fontSize: BODY_SM.size }}>Read-only access</span>
            </div>
          ) : (
            <Button
              variant="danger"
              disabled={isClosed || closing}
              loading={closing}
              onClick={() => setConfirmOpen(true)}
            >
              <XCircle size={16} />
              Close Ticket
            </Button>
          )}
        </div>
      </Card>

      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Close Ticket"
        subtitle="This will mark the ticket as closed and prevent further status changes."
        size="sm"
      >
        <div className="space-y-4">
          <p style={{ color: BODY_TEXT_GREY, fontSize: BODY_SM.size }}>
            Are you sure you want to close this ticket?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={closing}
              onClick={async () => {
                await onCloseTicket();
                setConfirmOpen(false);
              }}
            >
              Confirm Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
