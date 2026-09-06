"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Ticket,
  Status as TicketStatus,
  Priority as TicketPriority,
} from "@/types/ticket";
import { useTickets } from "@/context/TicketContext";
import { useAuth } from "@/hooks/useAuth";

export type TicketActivityType = "status" | "comment" | "assignment";

export type DashboardStatValue = {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  criticalTickets: number;
};

export type ChartPoint = {
  name: string;
  value: number;
};

export function useAgentDashboard() {
  const {
    tickets,
    updateTicketStatus,
    updateTicketPriority,
    addComment,
    reopenTicket,
  } = useTickets();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const activeTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === activeTicketId) ?? null,
    [activeTicketId, tickets],
  );

  const stats = useMemo<DashboardStatValue>(() => {
    const totalTickets = tickets.length;
    const openTickets = tickets.filter((t) => t.status === "OPEN").length;
    const inProgressTickets = tickets.filter(
      (t) => t.status === "IN_PROGRESS",
    ).length;
    const resolvedTickets = tickets.filter(
      (t) => t.status === "RESOLVED",
    ).length;
    const closedTickets = tickets.filter((t) => t.status === "CLOSED").length;
    const criticalTickets = tickets.filter(
      (t) =>
        t.priority === "CRITICAL" &&
        t.status !== "RESOLVED" &&
        t.status !== "CLOSED",
    ).length;

    return {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      criticalTickets,
    };
  }, [tickets]);

  const chartData = useMemo(() => {
    const statusCounts: Record<TicketStatus, number> = {
      OPEN: 0,
      IN_PROGRESS: 0,
      PENDING: 0,
      RESOLVED: 0,
      CLOSED: 0,
    };

    const priorityCounts: Record<TicketPriority, number> = {
      CRITICAL: 0,
      HIGH: 0,
      MEDIUM: 0,
      LOW: 0,
    };

    for (const ticket of tickets) {
      if (statusCounts[ticket.status] !== undefined) {
        statusCounts[ticket.status] += 1;
      }
      if (priorityCounts[ticket.priority] !== undefined) {
        priorityCounts[ticket.priority] += 1;
      }
    }

    return {
      ticketStatus: [
        { name: "Open", value: statusCounts.OPEN },
        { name: "In Progress", value: statusCounts.IN_PROGRESS },
        { name: "Resolved", value: statusCounts.RESOLVED },
        { name: "Closed", value: statusCounts.CLOSED },
      ],
      priority: [
        { name: "Critical", value: priorityCounts.CRITICAL },
        { name: "High", value: priorityCounts.HIGH },
        { name: "Medium", value: priorityCounts.MEDIUM },
        { name: "Low", value: priorityCounts.LOW },
      ],
    };
  }, [tickets]);

  const onOpenTicket = useCallback((ticket: Ticket) => {
    setActiveTicketId(ticket.id);
    setIsDrawerOpen(true);
  }, []);

  const onCloseTicketDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setActiveTicketId(null);
  }, []);

  const onUpdateStatus = useCallback(
    (status: TicketStatus) => {
      if (activeTicketId) {
        updateTicketStatus(activeTicketId, status);
      }
    },
    [activeTicketId, updateTicketStatus],
  );

  const onUpdatePriority = useCallback(
    (priority: TicketPriority) => {
      if (activeTicketId) {
        updateTicketPriority(activeTicketId, priority);
      }
    },
    [activeTicketId, updateTicketPriority],
  );

  const onReopenTicket = useCallback(() => {
    if (activeTicketId) {
      reopenTicket(activeTicketId);
    }
  }, [activeTicketId, reopenTicket]);

  const onAddComment = useCallback(
    (content: string) => {
      if (activeTicketId) {
        addComment(activeTicketId, content, user?.name || "Support Agent");
      }
    },
    [activeTicketId, addComment, user?.name],
  );

  return {
    agentName: user?.name || "Support Agent",
    pageTitle: "Support Agent Dashboard",
    pageDescription: "Manage, triage, and resolve system-wide support tickets.",
    roleLabel: "Support Agent (IT Support)",
    loading,
    tickets,
    activeTicket,
    isDrawerOpen,
    isCreateModalOpen,
    setIsCreateModalOpen,
    stats,
    chartData,
    actions: {
      onOpenTicket,
      onCloseTicketDrawer,
      onUpdateStatus,
      onUpdatePriority,
      onReopenTicket,
      onAddComment,
    },
  };
}
