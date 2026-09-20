import { NextRequest } from "next/server";
import { UserController } from "@/src/modules/users/user.controller";

const controller = new UserController();

/**
 * GET /api/admin/users - Get all users (Admin only)
 */
export async function GET(request: NextRequest) {
  return controller.getAll(request);
}

/**
 * POST /api/admin/users - Create a new user (Admin only)
 */
export async function POST(request: NextRequest) {
  return controller.create(request);
}
