import { NextRequest, NextResponse } from "next/server";
import { DashboardService } from "./dashboard.service";
import { requireAuth } from "@/src/middleware/auth.middleware";
import { handleApiError } from "@/src/shared/errors/error-handler";
import { successResponse } from "@/src/shared/responses/api-response";

export class DashboardController {
    private service: DashboardService;

    constructor() {
        this.service = new DashboardService();
    }

    async getAdminDashboard(request: NextRequest): Promise<NextResponse> {
        try {
            const user = await requireAuth();
            const dashboard = await this.service.getAdminDashboard(user);

            return successResponse(dashboard);
        } catch (error) {
            return handleApiError(error);
        }
    }

    async getAgentDashboard(request: NextRequest): Promise<NextResponse> {
        try {
            const user = await requireAuth();
            const dashboard = await this.service.getAgentDashboard(user);

            return successResponse(dashboard);
        } catch (error) {
            return handleApiError(error);
        }
    }

    async getEmployeeDashboard(request: NextRequest): Promise<NextResponse> {
        try {
            const user = await requireAuth();
            const dashboard = await this.service.getEmployeeDashboard(user);

            return successResponse(dashboard);
        } catch (error) {
            return handleApiError(error);
        }
    }
}
