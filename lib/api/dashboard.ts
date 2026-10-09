// API service for Dashboard
import { handleJsonResponse } from "@/lib/api-client";

export interface DashboardData {
  stats: {
    totalTickets: number;
    openTickets: number;
    closedToday: number;
    overdueTickets: number;
  };
  charts: {
    ticketsByStatus: {
      resolved: number;
      active: number;
      overdue: number;
    };
    ticketsByDepartment: Array<{ department: string; count: number }>;
    monthlyTickets: {
      labels: string[];
      data: number[];
    };
  };
  recentTickets: Array<{
    id: string;
    title: string;
    description: string;
    status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    categoryId: string;
    departmentId: string;
    requesterId: string;
    assigneeId: string | null;
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
    category: { id: string; name: string };
    department: { id: string; name: string };
    requester: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    assignee: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    } | null;
  }>;
}

export async function getDashboardData(): Promise<DashboardData> {
  const response = await fetch("/api/admin/dashboard", {
    method: "GET",
    credentials: "include",
  });

  const result = await handleJsonResponse(response);
  return result.data;
}
