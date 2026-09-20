import { NextRequest } from "next/server";
import { DashboardController } from "@/src/modules/dashboard/dashboard.controller";

const controller = new DashboardController();

/**
 * GET /api/employee/dashboard - Get employee dashboard data
 */
export async function GET(request: NextRequest) {
    return controller.getEmployeeDashboard(request);
}
