'use client';

import { NotificationItem } from '@/components/notifications/NotificationItem';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell } from 'lucide-react';

interface NotificationListProps {
  title?: string;
  description?: string;
}

export function NotificationList({
  title = 'Recent Updates',
  description = 'Alerts for assigned tickets, status changes, and comments.',
}: NotificationListProps) {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead, refreshNotifications } =
    useNotifications();

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">{title}</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {description}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={refreshNotifications}>
            Refresh
          </Button>
          {unreadCount > 0 ? (
            <Button onClick={markAllAsRead}>Mark all read</Button>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="h-8 w-8 text-emerald-600" />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="Ticket updates will appear here when activity occurs."
          icon={<Bell size={24} className="text-slate-400" />}
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={markAsRead}
            />
          ))}
        </div>
      )}
    </section>
  );
}