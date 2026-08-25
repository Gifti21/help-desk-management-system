"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCheck,
  AlertCircle,
  Inbox,
  ShieldAlert,
  Filter
} from "lucide-react";
import { useTickets, AppNotification } from "@/context/TicketContext";
import { BUTTONS } from "@/lib/colors";

export default function TechnicianNotificationsPage() {
  const {
    notifications,
    markNotificationsAsRead,
    markSingleNotificationAsRead
  } = useTickets();

  const [activeTab, setActiveTab] = useState<"ALL" | "UNREAD">("ALL");

  // Deduplicate notifications to prevent identical cards from rendering multiple times
  const uniqueNotifications = useMemo(() => {
    const seen = new Set<string>();
    return notifications.filter((item) => {
      // Create a unique fingerprint for each distinct notification
      const identifier = `${item.id}-${item.title}-${item.message}`;
      if (seen.has(identifier)) {
        return false;
      }
      seen.add(identifier);
      return true;
    });
  }, [notifications]);

  // Compute accurate unread count from the deduplicated list
  const unreadCount = useMemo(() => {
    return uniqueNotifications.filter((item) => !item.read).length;
  }, [uniqueNotifications]);

  const filteredNotifications = uniqueNotifications.filter((item) => {
    if (activeTab === "UNREAD") return !item.read;
    return true;
  });

  const getIcon = (title: string) => {
    if (title.includes("Assigned") || title.includes("Registered")) {
      return <Inbox className="w-5 h-5 text-emerald-700" />;
    }
    if (title.includes("Priority") || title.includes("Critical")) {
      return <ShieldAlert className="w-5 h-5 text-rose-600" />;
    }
    if (title.includes("Response") || title.includes("Note")) {
      return <Bell className="w-5 h-5 text-amber-600" />;
    }
    return <AlertCircle className="w-5 h-5 text-sky-600" />;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-5xl mx-auto bg-[#F4F7F6] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">Notifications & System Alerts</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time updates on assigned tickets, priority escalations, and requester responses.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markNotificationsAsRead}
            className="self-start sm:self-auto border-slate-300 bg-white text-slate-800 hover:bg-slate-50 font-bold shadow-xs"
          >
            <CheckCheck className="w-4 h-4 mr-1.5 text-emerald-700" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <Filter className="w-4 h-4 text-slate-500 mr-1" />
        <button
          onClick={() => setActiveTab("ALL")}
          style={{
            backgroundColor: activeTab === "ALL" ? BUTTONS.primary : "transparent",
            color: activeTab === "ALL" ? BUTTONS.primaryText : "#475569",
          }}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === "ALL"
            ? ""
            : "hover:text-slate-900 bg-white border border-slate-200"
            }`}
        >
          All Notifications ({uniqueNotifications.length})
        </button>
        <button
          onClick={() => setActiveTab("UNREAD")}
          style={{
            backgroundColor: activeTab === "UNREAD" ? BUTTONS.primary : "transparent",
            color: activeTab === "UNREAD" ? BUTTONS.primaryText : "#475569",
          }}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === "UNREAD"
            ? ""
            : "hover:text-slate-900 bg-white border border-slate-200"
            }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-slate-500 text-xs sm:text-sm shadow-xs">
            No notifications found.
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <Card
              key={item.id}
              onClick={() => markSingleNotificationAsRead(item.id)}
              className={`p-4 transition-all duration-200 cursor-pointer shadow-xs ${!item.read
                ? "bg-emerald-50/50 border-emerald-300 hover:border-emerald-500"
                : "bg-white border-slate-200 opacity-90 hover:opacity-100"
                }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                  {getIcon(item.title)}
                </div>

                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2 truncate">
                      <span className="font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] border border-emerald-200">
                        {item.ticketNumber}
                      </span>
                      {item.title}
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block shrink-0" />
                      )}
                    </h3>
                    <span className="text-[10px] sm:text-xs text-slate-500 shrink-0 font-mono font-medium">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{item.message}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}