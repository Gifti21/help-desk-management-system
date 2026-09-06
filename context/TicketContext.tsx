"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  Ticket,
  Status,
  Priority,
  Comment,
  TimelineEntry,
  getReferenceName,
} from "@/types/ticket";

export interface AppNotification {
  id: string;
  ticketNumber: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface TicketContextType {
  tickets: Ticket[];
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  addTicket: (
    ticket: Omit<
      Ticket,
      "id" | "ticketNumber" | "createdAt" | "updatedAt" | "comments" | "history"
    >,
  ) => void;
  updateTicket: (ticketId: string, updatedFields: Partial<Ticket>) => void;
  updateTicketStatus: (ticketId: string, status: Status) => void;
  updateTicketPriority: (ticketId: string, priority: Priority) => void;
  reopenTicket: (ticketId: string) => void;
  addComment: (ticketId: string, content: string, authorName?: string) => void;
  markNotificationsAsRead: () => void;
  markSingleNotificationAsRead: (id: string) => void;
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "t1",
    ticketNumber: "TICK-1024",
    title: "VPN connection dropping repeatedly during remote sessions",
    description:
      "Whenever I connect to the corporate gateway from home, the connection drops every 5 minutes and requires full re-authentication.",
    category: "Network",
    department: "Network",
    priority: "HIGH",
    status: "IN_PROGRESS",
    creatorName: "Abebe Tesfaye",
    creatorEmail: "abebe.t@besys.tech",
    assigneeId: "agent_bontu",
    assigneeName: "Bontu (Support Agent)",
    createdAt: "2026-07-28T08:30:00.000Z",
    updatedAt: "2026-07-29T14:15:00.000Z",
    comments: [
      {
        id: "c1",
        authorName: "Abebe Tesfaye",
        authorRole: "EMPLOYEE",
        timestamp: "2026-07-28T08:30:00.000Z",
        content:
          "Issue started happening after yesterday's network firmware patch.",
      },
      {
        id: "c2",
        authorName: "Bontu",
        authorRole: "AGENT",
        timestamp: "2026-07-28T09:10:00.000Z",
        content:
          "Investigating gateway authentication logs for packet loss and tunnel reset signals.",
      },
    ],
    history: [
      {
        id: "h1",
        timestamp: "2026-07-28T08:30:00.000Z",
        title: "Ticket Created",
        description: "Ticket logged by Abebe Tesfaye via Self-Service Portal.",
        type: "CREATED",
        actor: "Abebe Tesfaye",
      },
      {
        id: "h2",
        timestamp: "2026-07-28T09:00:00.000Z",
        title: "Status Changed",
        description: "Status changed from OPEN to IN_PROGRESS",
        type: "STATUS_CHANGE",
        actor: "Bontu",
      },
    ],
  },
  {
    id: "t2",
    ticketNumber: "TICK-1028",
    title: "Request for Figma Pro Team License Access",
    description:
      "Newly onboarded UI designer in Product Team requires Figma Pro tier license key for team design system access.",
    category: "Software",
    department: "Software",
    priority: "MEDIUM",
    status: "OPEN",
    creatorName: "Alice Smith",
    creatorEmail: "alice.s@besys.tech",
    assigneeId: "agent_bontu",
    assigneeName: "Bontu (Support Agent)",
    createdAt: "2026-07-29T10:00:00.000Z",
    updatedAt: "2026-07-29T10:00:00.000Z",
    comments: [
      {
        id: "c3",
        authorName: "Alice Smith",
        authorRole: "EMPLOYEE",
        timestamp: "2026-07-29T10:00:00.000Z",
        content: "Manager approval attached in internal request email #492.",
      },
    ],
    history: [
      {
        id: "h3",
        timestamp: "2026-07-29T10:00:00.000Z",
        title: "Ticket Created",
        description: "Ticket logged by Alice Smith.",
        type: "CREATED",
        actor: "Alice Smith",
      },
    ],
  },
  {
    id: "t3",
    ticketNumber: "TICK-1025",
    title: "Production DB Cluster High Latency Spikes",
    description:
      "Database latency peaking above 1200ms on secondary node during peak morning query execution cycles.",
    category: "Infrastructure",
    department: "Infrastructure",
    priority: "CRITICAL",
    status: "OPEN",
    creatorName: "Dawit Kebede",
    creatorEmail: "dawit.k@besys.tech",
    assigneeId: "agent_bontu",
    assigneeName: "Bontu (Support Agent)",
    createdAt: "2026-07-30T01:15:00.000Z",
    updatedAt: "2026-07-30T01:15:00.000Z",
    comments: [
      {
        id: "c4",
        authorName: "Dawit Kebede",
        authorRole: "EMPLOYEE",
        timestamp: "2026-07-30T01:15:00.000Z",
        content:
          "Alert triggered automatically from Prometheus/Grafana SLA watchdog.",
      },
    ],
    history: [
      {
        id: "h4",
        timestamp: "2026-07-30T01:15:00.000Z",
        title: "Ticket Created",
        description: "Automated alert logged by System Watchdog.",
        type: "CREATED",
        actor: "System Monitor",
      },
    ],
  },
  {
    id: "t4",
    ticketNumber: "TICK-1026",
    title: "Dual Monitor Setup Screen Flicker & HDMI Adapter Replacement",
    description:
      "Right monitor intermittently turns black when moving window frames between displays.",
    category: "Hardware",
    department: "Hardware",
    priority: "LOW",
    status: "RESOLVED",
    creatorName: "Elena Rostova",
    creatorEmail: "elena.r@besys.tech",
    assigneeId: "agent_bontu",
    assigneeName: "Bontu (Support Agent)",
    createdAt: "2026-07-25T11:00:00.000Z",
    updatedAt: "2026-07-26T16:30:00.000Z",
    comments: [
      {
        id: "c5",
        authorName: "Elena Rostova",
        authorRole: "EMPLOYEE",
        timestamp: "2026-07-25T11:00:00.000Z",
        content: "I tested a different cable and the issue persists.",
      },
      {
        id: "c6",
        authorName: "Bontu",
        authorRole: "AGENT",
        timestamp: "2026-07-26T16:30:00.000Z",
        content:
          "Replaced DisplayPort docking adapter with active converter. Confirmed stable display resolution.",
      },
    ],
    history: [
      {
        id: "h5",
        timestamp: "2026-07-25T11:00:00.000Z",
        title: "Ticket Created",
        description: "Ticket logged by Elena Rostova.",
        type: "CREATED",
        actor: "Elena Rostova",
      },
      {
        id: "h6",
        timestamp: "2026-07-26T16:30:00.000Z",
        title: "Status Changed",
        description: "Status changed to RESOLVED by Bontu.",
        type: "STATUS_CHANGE",
        actor: "Bontu",
      },
    ],
  },
  {
    id: "t5",
    ticketNumber: "TICK-1027",
    title: "Outlook Desktop Sync Failure & Exchange Authentication Error",
    description:
      "Exchange credentials fail to synchronize on desktop client while webmail functions properly.",
    category: "IT Support",
    department: "IT Support",
    priority: "HIGH",
    status: "IN_PROGRESS",
    creatorName: "Marcus Vance",
    creatorEmail: "marcus.v@besys.tech",
    assigneeId: "agent_bontu",
    assigneeName: "Bontu (Support Agent)",
    createdAt: "2026-07-29T15:20:00.000Z",
    updatedAt: "2026-07-29T16:00:00.000Z",
    comments: [
      {
        id: "c7",
        authorName: "Marcus Vance",
        authorRole: "EMPLOYEE",
        timestamp: "2026-07-29T15:20:00.000Z",
        content: "Getting error code 0x8004011D.",
      },
      {
        id: "c8",
        authorName: "Bontu",
        authorRole: "AGENT",
        timestamp: "2026-07-29T16:00:00.000Z",
        content:
          "Clearing local OST profile cache and regenerating OAuth tokens.",
      },
    ],
    history: [
      {
        id: "h7",
        timestamp: "2026-07-29T15:20:00.000Z",
        title: "Ticket Created",
        description: "Ticket logged by Marcus Vance.",
        type: "CREATED",
        actor: "Marcus Vance",
      },
    ],
  },
  {
    id: "t6",
    ticketNumber: "TICK-1029",
    title: "Shared Floor 3 Printer Spooler Paper Jam & Offline Alert",
    description:
      "Print jobs queued to 3F-HP-LaserJet remain stuck in spooling state.",
    category: "Hardware",
    department: "Hardware",
    priority: "MEDIUM",
    status: "CLOSED",
    creatorName: "Sara Connor",
    creatorEmail: "sara.c@besys.tech",
    assigneeId: "agent_bontu",
    assigneeName: "Bontu (Support Agent)",
    createdAt: "2026-07-24T09:00:00.000Z",
    updatedAt: "2026-07-24T11:45:00.000Z",
    comments: [
      {
        id: "c9",
        authorName: "Bontu",
        authorRole: "AGENT",
        timestamp: "2026-07-24T11:45:00.000Z",
        content: "Cleared jammed paper tray 2 and restarted spooler service.",
      },
    ],
    history: [
      {
        id: "h8",
        timestamp: "2026-07-24T09:00:00.000Z",
        title: "Ticket Created",
        description: "Ticket logged by Sara Connor.",
        type: "CREATED",
        actor: "Sara Connor",
      },
      {
        id: "h9",
        timestamp: "2026-07-24T11:45:00.000Z",
        title: "Ticket Closed",
        description: "Ticket closed and resolved verified.",
        type: "STATUS_CHANGE",
        actor: "Bontu",
      },
    ],
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    ticketNumber: "TICK-1024",
    title: "New Ticket Assigned",
    message: "VPN connection dropping repeatedly during remote sessions",
    timestamp: "10 mins ago",
    read: false,
  },
  {
    id: "n2",
    ticketNumber: "TICK-1028",
    title: "License Request Pending",
    message: "Request for Figma Pro Team License Access",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "n3",
    ticketNumber: "TICK-1025",
    title: "Critical Infrastructure Alert",
    message: "Production DB Cluster High Latency Spikes",
    timestamp: "3 hours ago",
    read: false,
  },
];

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider = ({ children }: { children: ReactNode }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(
    INITIAL_NOTIFICATIONS,
  );

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const response = await fetch("/api/tickets", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to load tickets");

        const data = await response.json();
        setTickets(
          data.map((ticket: any) => ({
            ...ticket,
            ticketNumber: ticket.ticketNumber || ticket.id,
            category: getReferenceName(ticket.category),
            department: getReferenceName(ticket.department),
            creatorName: ticket.requester
              ? `${ticket.requester.firstName} ${ticket.requester.lastName}`
              : "Employee",
            creatorEmail: ticket.requester?.email,
            assigneeName: ticket.assignee
              ? `${ticket.assignee.firstName} ${ticket.assignee.lastName}`
              : undefined,
            comments: (ticket.comments || []).map((comment: any) => ({
              id: comment.id,
              content: comment.content,
              authorId: comment.authorId,
              authorName: comment.author
                ? `${comment.author.firstName} ${comment.author.lastName}`
                : "User",
              authorRole: comment.author?.role || "USER",
              timestamp: comment.createdAt,
            })),
            history: [],
          })),
        );
      } catch (error) {
        console.error("Failed to load technician tickets:", error);
      }
    };

    loadTickets();
  }, []);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const triggerUpdateNotification = (
    ticketNumber: string,
    title: string,
    message: string,
  ) => {
    const newNotification: AppNotification = {
      id: `notif_${Date.now()}`,
      ticketNumber,
      title,
      message,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markSingleNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const addTicket = async (
    newTicketData: Omit<
      Ticket,
      "id" | "ticketNumber" | "createdAt" | "updatedAt" | "comments" | "history"
    >,
  ) => {
    const formDataResponse = await fetch("/api/ticket-form-data", {
      credentials: "include",
    });
    if (!formDataResponse.ok) throw new Error("Failed to load ticket options");
    const formData = await formDataResponse.json();
    const category = formData.categories.find((item: { name: string }) => item.name === newTicketData.category);
    const department = formData.departments.find((item: { name: string }) => item.name === newTicketData.department);
    if (!category || !department) throw new Error("Ticket category or department is no longer available");

    const response = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: newTicketData.title,
        description: newTicketData.description,
        priority: newTicketData.priority,
        categoryId: category.id,
        departmentId: department.id,
        requesterEmail: newTicketData.creatorEmail,
      }),
    });
    if (!response.ok) throw new Error((await response.json()).error || "Failed to create ticket");
    const createdTicket = await response.json();
    setTickets((prev) => [createdTicket, ...prev]);
  };

  const updateTicket = (ticketId: string, updatedFields: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updated = {
            ...t,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
          };
          triggerUpdateNotification(
            updated.ticketNumber,
            "Ticket Updated",
            updated.title,
          );
          return updated;
        }
        return t;
      }),
    );
  };

  const updateTicketStatus = async (ticketId: string, status: Status) => {
    const response = await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update ticket status");

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const timestamp = new Date().toISOString();
          const statusHistory: TimelineEntry = {
            id: `h_${Date.now()}`,
            timestamp,
            title:
              status === "CLOSED"
                ? "Ticket Closed"
                : `Status updated to ${status}`,
            description: `Ticket status transitioned from ${t.status} to ${status}`,
            type: "STATUS_CHANGE",
            actor: "Bontu",
          };

          triggerUpdateNotification(
            t.ticketNumber,
            "Status Changed",
            `Status updated to ${status}`,
          );
          return {
            ...t,
            status,
            updatedAt: timestamp,
            closedAt:
              status === "CLOSED" || status === "RESOLVED" ? timestamp : null,
            history: [...(t.history || []), statusHistory],
          };
        }
        return t;
      }),
    );
  };

  const updateTicketPriority = async (ticketId: string, priority: Priority) => {
    const response = await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ priority }),
    });
    if (!response.ok) throw new Error("Failed to update ticket priority");

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const timestamp = new Date().toISOString();
          const priorityHistory: TimelineEntry = {
            id: `h_${Date.now()}`,
            timestamp,
            title: `Priority set to ${priority}`,
            description: `Priority adjusted from ${t.priority} to ${priority}`,
            type: "PRIORITY_CHANGE",
            actor: "Bontu",
          };

          triggerUpdateNotification(
            t.ticketNumber,
            "Priority Adjusted",
            `Priority set to ${priority}`,
          );
          return {
            ...t,
            priority,
            updatedAt: timestamp,
            history: [...(t.history || []), priorityHistory],
          };
        }
        return t;
      }),
    );
  };

  const reopenTicket = async (ticketId: string) => {
    const response = await fetch(`/api/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: "IN_PROGRESS" }),
    });
    if (!response.ok) throw new Error("Failed to reopen ticket");

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const timestamp = new Date().toISOString();
          const reopenHistory: TimelineEntry = {
            id: `h_${Date.now()}`,
            timestamp,
            title: "Ticket Re-opened",
            description:
              "Ticket re-opened for further investigation and triage.",
            type: "STATUS_CHANGE",
            actor: "Bontu",
          };

          const systemComment: Comment = {
            id: `c_${Date.now()}`,
            authorName: "Bontu",
            authorRole: "AGENT",
            timestamp,
            content:
              "Ticket re-opened by Support Agent. Restoring to active queue.",
          };

          triggerUpdateNotification(
            t.ticketNumber,
            "Ticket Re-opened",
            "Ticket has been returned to active queue.",
          );
          return {
            ...t,
            status: "IN_PROGRESS",
            closedAt: null,
            updatedAt: timestamp,
            comments: [...(t.comments || []), systemComment],
            history: [...(t.history || []), reopenHistory],
          };
        }
        return t;
      }),
    );
  };

  const addComment = async (
    ticketId: string,
    content: string,
    authorName = "Bontu",
  ) => {
    const response = await fetch(`/api/tickets/${ticketId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error("Failed to add comment");

    const timestamp = new Date().toISOString();
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      authorName,
      authorRole: authorName === "Bontu" ? "AGENT" : "EMPLOYEE",
      timestamp,
      content,
    };

    const commentHistory: TimelineEntry = {
      id: `h_${Date.now()}`,
      timestamp,
      title: "New Note / Comment",
      description: `Comment posted by ${authorName}`,
      type: "COMMENT",
      actor: authorName,
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          triggerUpdateNotification(
            t.ticketNumber,
            "New Response Posted",
            content.substring(0, 40) + "...",
          );
          return {
            ...t,
            comments: [...(t.comments || []), newComment],
            history: [...(t.history || []), commentHistory],
            updatedAt: timestamp,
          };
        }
        return t;
      }),
    );
  };

  return (
    <TicketContext.Provider
      value={{
        tickets,
        notifications,
        unreadNotificationsCount,
        addTicket,
        updateTicket,
        updateTicketStatus,
        updateTicketPriority,
        reopenTicket,
        addComment,
        markNotificationsAsRead,
        markSingleNotificationAsRead,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context)
    throw new Error("useTickets must be used within a TicketProvider");
  return context;
};
