'use client';

import Link from 'next/link';
import { NOTIFICATION_TYPE_LABELS } from '@/constants/notificationTypes';
import { formatDate } from '@/utils/formatDate';
import type { Notification } from '@/types/notification';
import { BUTTONS } from '@/lib/colors';

interface NotificationItemProps {
  notification: Notification;
  compact?: boolean;
  onRead?: (id: string) => void;
  onNavigate?: () => void;
}

export function NotificationItem({
  notification,
  compact = false,
  onRead,
  onNavigate,
}: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.read) {
      onRead?.(notification.id);
    }
    onNavigate?.();
  };

  return (
    <Link
      href={`/tickets/${notification.ticketId}`}
      onClick={handleClick}
      className={`block transition hover:bg-slate-50 ${
        compact 
          ? 'px-4 py-3' 
          : 'rounded-xl border border-slate-200 bg-white p-4 shadow-xs mb-3'
      } ${notification.read ? 'opacity-75' : 'bg-white font-medium'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className={`text-xs ${
              notification.read ? 'font-semibold text-slate-700' : 'font-bold text-slate-900'
            }`}
          >
            {notification.title}
          </p>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            {notification.message}
          </p>
          <p className="mt-2 text-[10px] font-mono text-slate-400 font-medium">
            <span 
              className="font-semibold"
              style={{ color: BUTTONS.primary }}
            >
              {NOTIFICATION_TYPE_LABELS[notification.type]}
            </span>{' '}
            · {formatDate(notification.createdAt)}
          </p>
        </div>

        {!notification.read ? (
          <span
            className="mt-1.5 h-2 w-2 shrink-0 rounded-full ring-4 ring-emerald-50"
            style={{ backgroundColor: BUTTONS.primary }}
            aria-label="Unread notification"
          />
        ) : null}
      </div>
    </Link>
  );
}