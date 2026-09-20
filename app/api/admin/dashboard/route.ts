import { NextRequest } from "next/server";
import { DashboardController } from "@/src/modules/dashboard/dashboard.controller";

const controller = new DashboardController();

/**
 * GET /api/admin/dashboard - Get admin dashboard data
 */
export async function GET(request: NextRequest) {
  return controller.getAdminDashboard(request);
}
