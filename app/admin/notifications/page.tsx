"use client";

import React, { useState, useMemo } from "react";
import { PageLayout } from "@/components/admin/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Bell,
    CheckCheck,
    AlertCircle,
    Inbox,
    ShieldAlert,
    Filter,
    MessageSquare,
    UserPlus,
    Settings,
} from "lucide-react";
import { BUTTONS } from "@/lib/colors";

// Mock admin notifications data
const mockAdminNotifications = [
    {
        id: "admin-1",
        title: "New User Registration",
        message: "John Smith has registered as a new employee and requires account activation.",
        timestamp: "2 mins ago",
        read: false,
        ticketNumber: "",
    },
    {
        id: "admin-2",
        title: "Critical System Alert",
        message: "Database connection pool is running at 95% capacity. Consider scaling resources.",
        timestamp: "15 mins ago",
        read: false,
        ticketNumber: "",
    },
    {
        id: "admin-3",
        title: "High Priority Ticket Assigned",
        message: "Ticket TICK-1024 has been escalated to high priority and requires immediate attention.",
        timestamp: "1 hour ago",
        read: true,
        ticketNumber: "TICK-1024",
    },
    {
        id: "admin-4",
        title: "Department Settings Updated",
        message: "IT Department configuration has been modified by Sarah Johnson.",
        timestamp: "3 hours ago",
        read: true,
        ticketNumber: "",
    },
    {
        id: "admin-5",
        title: "Bulk Ticket Assignment",
        message: "15 tickets have been automatically assigned to technicians based on workload balancing.",
        timestamp: "1 day ago",
        read: true,
        ticketNumber: "",
    },
];

export default function AdminNotificationsPage() {
    const [notifications, setNotifications] = useState(mockAdminNotifications);
    const [activeTab, setActiveTab] = useState<"ALL" | "UNREAD">("ALL");

    const unreadCount = useMemo(() => {
        return notifications.filter((item) => !item.read).length;
    }, [notifications]);

    const filteredNotifications = notifications.filter((item) => {
        if (activeTab === "UNREAD") return !item.read;
        return true;
    });

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    };

    const markSingleAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const getIcon = (title: string) => {
        if (title.includes("User") || title.includes("Registration")) {
            return <UserPlus className="w-5 h-5 text-sky-600" />;
        }
        if (title.includes("Assigned") || title.includes("Ticket")) {
            return <Inbox className="w-5 h-5 text-emerald-700" />;
        }
        if (title.includes("Priority") || title.includes("Critical") || title.includes("Alert")) {
            return <ShieldAlert className="w-5 h-5 text-rose-600" />;
        }
        if (title.includes("System") || title.includes("Settings") || title.includes("Department")) {
            return <Settings className="w-5 h-5 text-purple-600" />;
        }
        if (title.includes("Response") || title.includes("Comment")) {
            return <MessageSquare className="w-5 h-5 text-amber-600" />;
        }
        return <Bell className="w-5 h-5 text-slate-600" />;
    };

    return (
        <PageLayout title="Notifications" subtitle="System alerts and administrative updates">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                                All Notifications
                            </h2>
                            {unreadCount > 0 && (
                                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                                    {unreadCount} Unread
                                </span>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">
                            Monitor system-wide activity, user actions, and ticket operations.
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={markAllAsRead}
                            className="self-start sm:self-auto border-slate-300 bg-white text-slate-800 hover:bg-slate-50 font-bold shadow-xs"
                        >
                            <CheckCheck className="w-4 h-4 mr-1.5 text-emerald-700" />
                            Mark all as read
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                    <Filter className="w-4 h-4 text-slate-500 mr-1" />
                    <button
                        onClick={() => setActiveTab("ALL")}
                        style={{
                            backgroundColor:
                                activeTab === "ALL" ? BUTTONS.primary : "transparent",
                            color: activeTab === "ALL" ? BUTTONS.primaryText : "#475569",
                        }}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors ${activeTab === "ALL"
                                ? ""
                                : "hover:text-slate-900 bg-white border border-slate-200"
                            }`}
                    >
                        All Notifications ({notifications.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("UNREAD")}
                        style={{
                            backgroundColor:
                                activeTab === "UNREAD" ? BUTTONS.primary : "transparent",
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

                <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-slate-500 text-xs sm:text-sm shadow-xs">
                            No notifications found.
                        </div>
                    ) : (
                        filteredNotifications.map((item) => (
                            <Card
                                key={item.id}
                                onClick={() => markSingleAsRead(item.id)}
                                className={`p-4 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md ${!item.read
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
                                                {item.ticketNumber && (
                                                    <span className="font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] border border-emerald-200">
                                                        {item.ticketNumber}
                                                    </span>
                                                )}
                                                {item.title}
                                                {!item.read && (
                                                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block shrink-0" />
                                                )}
                                            </h3>
                                            <span className="text-[10px] sm:text-xs text-slate-500 shrink-0 font-mono font-medium">
                                                {item.timestamp}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-700 leading-relaxed">
                                            {item.message}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </PageLayout>
    );
}