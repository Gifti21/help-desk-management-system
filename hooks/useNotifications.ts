'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { NOTIFICATION_TYPE_LABELS } from '@/constants/notificationTypes';
import { TICKET_STATUS_LABELS } from '@/constants/ticketStatuses';
import { PRIORITY_LABELS } from '@/constants/priorities';
import { useAuth } from '@/hooks/useAuth';
import { useTickets } from '@/hooks/useTickets';
import type { Notification, NotificationType } from '@/types/notification';
import type { Ticket } from '@/types/ticket';

const READ_STORAGE_KEY = 'hdms-read-notifications';

type UseNotificationsResult = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => void;
};

function buildNotificationId(ticketId: string, type: NotificationType, timestamp: string): string {
  return `${ticketId}-${type}-${timestamp}`;
}

function deriveNotifications(tickets: Ticket[], userId?: string): Notification[] {
  const items: Notification[] = [];

  for (const ticket of tickets) {
    const isAssignedToMe = ticket.assigneeId === userId;

    if (isAssignedToMe) {
      items.push({
        id: buildNotificationId(ticket.id, 'TICKET_ASSIGNED', ticket.updatedAt),
        type: 'TICKET_ASSIGNED',
        title: NOTIFICATION_TYPE_LABELS.TICKET_ASSIGNED,
        message: `${ticket.title} is assigned to you.`,
        ticketId: ticket.id,
        read: false,
        createdAt: ticket.updatedAt,
      });
    }

    items.push({
      id: buildNotificationId(ticket.id, 'TICKET_STATUS_CHANGED', ticket.updatedAt),
      type: 'TICKET_STATUS_CHANGED',
      title: NOTIFICATION_TYPE_LABELS.TICKET_STATUS_CHANGED,
      message: `${ticket.title} is ${TICKET_STATUS_LABELS[ticket.status]}.`,
      ticketId: ticket.id,
      read: false,
      createdAt: ticket.updatedAt,
    });

    if (ticket.status === 'CLOSED') {
      items.push({
        id: buildNotificationId(ticket.id, 'TICKET_CLOSED', ticket.closedAt ?? ticket.updatedAt),
        type: 'TICKET_CLOSED',
        title: NOTIFICATION_TYPE_LABELS.TICKET_CLOSED,
        message: `${ticket.title} has been closed.`,
        ticketId: ticket.id,
        read: false,
        createdAt: ticket.closedAt ?? ticket.updatedAt,
      });
    }

    if (ticket.priority === 'CRITICAL' || ticket.priority === 'HIGH') {
      items.push({
        id: buildNotificationId(ticket.id, 'TICKET_PRIORITY_CHANGED', ticket.updatedAt),
        type: 'TICKET_PRIORITY_CHANGED',
        title: NOTIFICATION_TYPE_LABELS.TICKET_PRIORITY_CHANGED,
        message: `${ticket.title} priority is ${PRIORITY_LABELS[ticket.priority]}.`,
        ticketId: ticket.id,
        read: false,
        createdAt: ticket.updatedAt,
      });
    }
  }

  return items
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 30);
}

function loadReadIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(READ_STORAGE_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(ids)));
}

export function useNotifications(): UseNotificationsResult {
  const { user } = useAuth();
  const { tickets, loading, refresh } = useTickets({ assignedOnly: false });
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setReadIds(loadReadIds());
  }, []);

  const notifications = useMemo(() => {
    const derived = deriveNotifications(tickets, user?.id);
    return derived.map((notification) => ({
      ...notification,
      read: readIds.has(notification.id),
    }));
  }, [readIds, tickets, user?.id]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  const markAsRead = useCallback((id: string) => {
    setReadIds((current) => {
      const next = new Set(current);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setReadIds((current) => {
      const next = new Set(current);
      notifications.forEach((notification) => next.add(notification.id));
      saveReadIds(next);
      return next;
    });
  }, [notifications]);

  const refreshNotifications = useCallback(() => {
    void refresh();
  }, [refresh]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  };
}
