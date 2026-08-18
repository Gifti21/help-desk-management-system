'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { NotificationItem } from '@/components/notifications/NotificationItem';
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const preview = notifications.slice(0, 5);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen((current) => !current)}
        className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-50 transition shadow-xs cursor-pointer"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] font-bold px-1 shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 px-4 py-3 bg-slate-50">
            <p className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Notifications</p>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {preview.length === 0 ? (
              <p className="px-4 py-6 text-xs text-slate-500 text-center">
                No notifications yet.
              </p>
            ) : (
              preview.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  compact
                  onRead={markAsRead}
                  onNavigate={() => setOpen(false)}
                />
              ))
            )}
          </div>

          <div className="border-t border-slate-100 px-4 py-3 text-right bg-slate-50">
            <Link
              href="/notifications"
              className="text-xs font-bold text-emerald-700 hover:underline"
              onClick={() => setOpen(false)}
            >
              View all
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}