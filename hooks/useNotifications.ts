"use client";

import { useCallback, useEffect, useState } from "react";
import type { Notification } from "@/types/notification";

type UseNotificationsResult = {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => void;
};

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const refreshNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/notifications", {
        credentials: "include",
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to load notifications");
      const result = (await response.json()) as {
        data?:
          | Notification[]
          | { notifications?: Notification[]; unreadCount?: number };
        notifications?: Notification[];
        unreadCount?: number;
      };
      const payload = result.data;
      const notifications = Array.isArray(payload)
        ? payload
        : Array.isArray(result.notifications)
          ? result.notifications
          : Array.isArray(payload?.notifications)
            ? payload.notifications
            : [];
      const unreadCount =
        typeof result.unreadCount === "number"
          ? result.unreadCount
          : typeof payload?.unreadCount === "number"
            ? payload.unreadCount
            : notifications.filter((notification) => !notification.read).length;

      setNotifications(notifications);
      setUnreadCount(unreadCount);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshNotifications();
  }, [refreshNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );
    setUnreadCount((current) => Math.max(0, current - 1));
    await fetch("/api/notifications", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: id }),
    });
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((current) =>
      current.map((item) => ({ ...item, read: true })),
    );
    setUnreadCount(0);
    await fetch("/api/notifications", {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refreshNotifications: () => {
      void refreshNotifications();
    },
  };
}
