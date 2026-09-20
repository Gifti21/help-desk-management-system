import { NextRequest } from "next/server";
import { DashboardController } from "@/src/modules/dashboard/dashboard.controller";

const controller = new DashboardController();

/**
 * GET /api/agent/dashboard - Get agent dashboard data
 * Shows ONLY tickets assigned to the current agent
 */
export async function GET(request: NextRequest) {
    return controller.getAgentDashboard(request);
}
