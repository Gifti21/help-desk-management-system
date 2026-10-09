// API service for Reports
import { handleJsonResponse } from "@/lib/api-client";

export interface ReportsData {
    overview: {
        totalTickets: number;
        totalUsers: number;
        totalDepartments: number;
        totalCategories: number;
        openTickets: number;
        inProgressTickets: number;
        resolvedTickets: number;
        closedTickets: number;
    };
    ticketsByStatus: Array<{ status: string; count: number }>;
    ticketsByPriority: Array<{ priority: string; count: number }>;
    ticketsByDepartment: Array<{ department: string; count: number }>;
    ticketsByCategory: Array<{ category: string; count: number }>;
    usersByRole: Array<{ role: string; count: number }>;
    usersByDepartment: Array<{ department: string; count: number }>;
    recentTickets: Array<any>;
    topCategories: Array<{ id: string; name: string; ticketCount: number }>;
    departmentPerformance: Array<{ id: string; name: string; ticketCount: number; userCount: number }>;
}

export async function getReports(): Promise<ReportsData> {
    const response = await fetch('/api/admin/reports', {
        method: 'GET',
        credentials: 'include',
    });

    const result = await handleJsonResponse(response);
    return result.data;
}
