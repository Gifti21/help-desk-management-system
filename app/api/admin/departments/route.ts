import { NextRequest } from "next/server";
import { DepartmentController } from "@/src/modules/departments/department.controller";

const controller = new DepartmentController();

/**
 * GET /api/admin/departments - Get all departments (Admin only)
 */
export async function GET(request: NextRequest) {
  return controller.getAll(request);
}

/**
 * POST /api/admin/departments - Create a new department (Admin only)
 */
export async function POST(request: NextRequest) {
  return controller.create(request);
}
