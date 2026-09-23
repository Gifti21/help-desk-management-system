import { DashboardRepository } from "./dashboard.repository";
import { SessionUser } from "@/src/infrastructure/authentication/session";
import { ForbiddenError } from "@/src/shared/errors/AppError";

export class DashboardService {
    private repository: DashboardRepository;

    constructor() {
        this.repository = new DashboardRepository();
    }

    async getAdminDashboard(user: SessionUser) {
        if (user.role !== "ADMIN") {
            throw new ForbiddenError("Admin access required");
        }

        const [
            totalTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
            closedTickets,
            totalUsers,
            activeUsers,
            totalDepartments,
            totalCategories,
            recentTickets,
            ticketsByDepartment,
            monthlyTickets,
        ] = await Promise.all([
            this.repository.countAllTickets(),
            this.repository.countTicketsByStatus("OPEN"),
            this.repository.countTicketsByStatus("IN_PROGRESS"),
            this.repository.countTicketsByStatus("RESOLVED"),
            this.repository.countTicketsByStatus("CLOSED"),
            this.repository.countAllUsers(),
            this.repository.countActiveUsers(),
            this.repository.countAllDepartments(),
            this.repository.countAllCategories(),
            this.repository.getRecentTickets(50),
            this.repository.getTicketsByDepartment(),
            this.repository.getMonthlyTickets(),
        ]);

        // Calculate closed today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const closedToday = recentTickets.filter(ticket => {
            if (!ticket.closedAt) return false;
            const closedDate = new Date(ticket.closedAt);
            return closedDate >= today;
        }).length;

        // Calculate overdue tickets (OPEN or IN_PROGRESS for more than 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const overdueTickets = recentTickets.filter(ticket => {
            if (ticket.status === "RESOLVED" || ticket.status === "CLOSED") return false;
            const createdDate = new Date(ticket.createdAt);
            return createdDate < sevenDaysAgo;
        }).length;

        return {
            stats: {
                totalTickets,
                openTickets,
                closedToday,
                overdueTickets,
            },
            charts: {
                ticketsByStatus: {
                    resolved: resolvedTickets,
                    active: openTickets + inProgressTickets,
                    overdue: overdueTickets,
                },
                ticketsByDepartment: ticketsByDepartment || [],
                monthlyTickets: monthlyTickets || { labels: [], data: [] },
            },
            recentTickets,
        };
    }

    async getAgentDashboard(user: SessionUser) {
        if (user.role !== "AGENT") {
            throw new ForbiddenError("Agent access required");
        }

        const [
            assignedTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
            recentTickets,
        ] = await Promise.all([
            this.repository.countTicketsByAssignee(user.id),
            this.repository.countTicketsByAssigneeAndStatus(user.id, "OPEN"),
            this.repository.countTicketsByAssigneeAndStatus(user.id, "IN_PROGRESS"),
            this.repository.countTicketsByAssigneeAndStatus(user.id, "RESOLVED"),
            this.repository.getTicketsByAssignee(user.id, 10),
        ]);

        return {
            tickets: {
                assigned: assignedTickets,
                open: openTickets,
                inProgress: inProgressTickets,
                resolved: resolvedTickets,
            },
            recentTickets,
        };
    }

    async getEmployeeDashboard(user: SessionUser) {
        if (user.role !== "EMPLOYEE") {
            throw new ForbiddenError("Employee access required");
        }

        const [
            totalTickets,
            openTickets,
            inProgressTickets,
            resolvedTickets,
            closedTickets,
            recentTickets,
        ] = await Promise.all([
            this.repository.countTicketsByRequester(user.id),
            this.repository.countTicketsByRequesterAndStatus(user.id, "OPEN"),
            this.repository.countTicketsByRequesterAndStatus(user.id, "IN_PROGRESS"),
            this.repository.countTicketsByRequesterAndStatus(user.id, "RESOLVED"),
            this.repository.countTicketsByRequesterAndStatus(user.id, "CLOSED"),
            this.repository.getTicketsByRequester(user.id, 10),
        ]);

        return {
            stats: {
                total: totalTickets,
                open: openTickets,
                inProgress: inProgressTickets,
                resolved: resolvedTickets,
                closed: closedTickets,
            },
            recentTickets,
        };
    }
}
