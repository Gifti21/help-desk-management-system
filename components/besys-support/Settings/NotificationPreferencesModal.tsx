"use client";

import { useState } from "react";
import { DARK_GREEN, BORDER_GREY, PRIMARY_TEXT, BODY_TEXT_GREY } from "@/lib/colors";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: NotificationPreferences) => void;
}

interface NotificationPreferences {
  emailNotifications: boolean;
  ticketStatusUpdates: boolean;
  newTicketAssigned: boolean;
  weeklySummary: boolean;
}

export function NotificationPreferencesModal({ isOpen, onClose, onSave }: NotificationPreferencesModalProps) {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [ticketStatusUpdates, setTicketStatusUpdates] = useState(true);
  const [newTicketAssigned, setNewTicketAssigned] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);

  const handleSave = () => {
    const preferences: NotificationPreferences = {
      emailNotifications,
      ticketStatusUpdates,
      newTicketAssigned,
      weeklySummary,
    };
    onSave(preferences);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Notification Preferences">
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: BORDER_GREY }}>
          <div>
            <p
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                color: "#1a1d1c",
              }}
            >
              Email Notifications
            </p>
            <p
              className="mt-1"
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "14px",
                color: "#6b6e6c",
              }}
            >
              Receive email updates about your tickets
            </p>
          </div>
          <button
            onClick={() => setEmailNotifications(!emailNotifications)}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition"
            style={{
              backgroundColor: emailNotifications ? DARK_GREEN : BORDER_GREY,
            }}
          >
            <span
              className="inline-block h-4 w-4 transform rounded-full bg-white transition"
              style={{
                transform: emailNotifications ? "translateX(1.5rem)" : "translateX(0.25rem)",
              }}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: BORDER_GREY }}>
          <div>
            <p
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                color: "#1a1d1c",
              }}
            >
              Ticket Status Updates
            </p>
            <p
              className="mt-1"
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "14px",
                color: "#6b6e6c",
              }}
            >
              Get notified when ticket status changes
            </p>
          </div>
          <button
            onClick={() => setTicketStatusUpdates(!ticketStatusUpdates)}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition"
            style={{
              backgroundColor: ticketStatusUpdates ? DARK_GREEN : BORDER_GREY,
            }}
          >
            <span
              className="inline-block h-4 w-4 transform rounded-full bg-white transition"
              style={{
                transform: ticketStatusUpdates ? "translateX(1.5rem)" : "translateX(0.25rem)",
              }}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: BORDER_GREY }}>
          <div>
            <p
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                color: "#1a1d1c",
              }}
            >
              New Ticket Assigned
            </p>
            <p
              className="mt-1"
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "14px",
                color: "#6b6e6c",
              }}
            >
              Notify when a new ticket is assigned to you
            </p>
          </div>
          <button
            onClick={() => setNewTicketAssigned(!newTicketAssigned)}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition"
            style={{
              backgroundColor: newTicketAssigned ? DARK_GREEN : BORDER_GREY,
            }}
          >
            <span
              className="inline-block h-4 w-4 transform rounded-full bg-white transition"
              style={{
                transform: newTicketAssigned ? "translateX(1.5rem)" : "translateX(0.25rem)",
              }}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3">
          <div>
            <p
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
                color: "#1a1d1c",
              }}
            >
              Weekly Summary
            </p>
            <p
              className="mt-1"
              style={{
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: "14px",
                color: "#6b6e6c",
              }}
            >
              Receive weekly digest of your tickets
            </p>
          </div>
          <button
            onClick={() => setWeeklySummary(!weeklySummary)}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition"
            style={{
              backgroundColor: weeklySummary ? DARK_GREEN : BORDER_GREY,
            }}
          >
            <span
              className="inline-block h-4 w-4 transform rounded-full bg-white transition"
              style={{
                transform: weeklySummary ? "translateX(1.5rem)" : "translateX(0.25rem)",
              }}
            />
          </button>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Save Preferences
          </Button>
        </div>
      </div>
    </Modal>
  );
}
