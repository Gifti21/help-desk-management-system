"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { useEmployeeProfile } from "@/lib/hooks/useEmployeeProfile";
import {
    Bell,
    CheckCheck,
    AlertCircle,
    Inbox,
    ShieldAlert,
    Filter,
    MessageSquare,
    Clock,
} from "lucide-react";
import { BUTTONS, PAGE_BACKGROUND } from "@/lib/colors";

// Mock employee notifications data
const mockEmployeeNotifications = [
    {
        id: "emp-1",
        title: "Ticket Update",
        message: "Your ticket TICK-2048 has been assigned to technician Mike Johnson.",
        timestamp: "5 mins ago",
        read: false,
        ticketNumber: "TICK-2048",
    },
    {
        id: "emp-2",
        title: "New Comment on Ticket",
        message: "Technician replied: 'We have identified the issue and are working on a solution.'",
        timestamp: "30 mins ago",
        read: false,
        ticketNumber: "TICK-2048",
    },
    {
        id: "emp-3",
        title: "Ticket Status Changed",
        message: "Your ticket TICK-1987 status has been updated to 'In Progress'.",
        timestamp: "2 hours ago",
        read: true,
        ticketNumber: "TICK-1987",
    },
    {
        id: "emp-4",
        title: "Ticket Resolved",
        message: "Your network connectivity issue has been resolved. Please verify the fix.",
        timestamp: "1 day ago",
        read: true,
        ticketNumber: "TICK-1856",
    },
    {
        id: "emp-5",
        title: "Priority Update",
        message: "Your ticket TICK-2048 has been marked as high priority due to system impact.",
        timestamp: "2 days ago",
        read: true,
        ticketNumber: "TICK-2048",
    },
    {
        id: "emp-6",
        title: "Support Request Confirmation",
        message: "Your support request for email setup has been received and will be processed within 24 hours.",
        timestamp: "3 days ago",
        read: true,
        ticketNumber: "TICK-2156",
    },
];

export default function EmployeeNotificationsPage() {
    const { profile } = useEmployeeProfile();
    const [notifications, setNotifications] = useState(mockEmployeeNotifications);
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
        if (title.includes("Assigned") || title.includes("Update")) {
            return <Inbox className="w-5 h-5 text-emerald-700" />;
        }
        if (title.includes("Priority") || title.includes("Urgent")) {
            return <ShieldAlert className="w-5 h-5 text-rose-600" />;
        }
        if (title.includes("Comment") || title.includes("Reply")) {
            return <MessageSquare className="w-5 h-5 text-sky-600" />;
        }
        if (title.includes("Resolved") || title.includes("Completed")) {
            return <CheckCheck className="w-5 h-5 text-emerald-600" />;
        }
        if (title.includes("Status") || title.includes("Progress")) {
            return <Clock className="w-5 h-5 text-amber-600" />;
        }
        return <Bell className="w-5 h-5 text-slate-600" />;
    };

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: PAGE_BACKGROUND }}
        >
            <Sidebar role="EMPLOYEE" />

            <div className="flex-1 lg:pl-64 flex flex-col">
                <DashboardHeader
                    userName={profile.fullName}
                    userInitials={profile.initials}
                    role="EMPLOYEE"
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-5xl mx-auto space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                                        Notifications
                                    </h1>
                                    {unreadCount > 0 && (
                                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                                            {unreadCount} Unread
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                                    Stay updated on your ticket status, responses, and support updates.
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
                </main>
            </div>
        </div>
    );
}