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
            this.repository.getRecentTickets(5),
        ]);

        return {
            tickets: {
                total: totalTickets,
                open: openTickets,
                inProgress: inProgressTickets,
                resolved: resolvedTickets,
                closed: closedTickets,
            },
            users: {
                total: totalUsers,
                active: activeUsers,
            },
            departments: totalDepartments,
            categories: totalCategories,
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
