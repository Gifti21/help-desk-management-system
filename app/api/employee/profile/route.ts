import { NextRequest } from "next/server";
import { ProfileController } from "@/src/modules/profile/profile.controller";

const controller = new ProfileController();

/**
 * GET /api/employee/profile - Get employee profile
 */
export async function GET(request: NextRequest) {
  return controller.getProfile(request);
}

/**
 * PATCH /api/employee/profile - Update employee profile
 */
export async function PATCH(request: NextRequest) {
  return controller.updateProfile(request);
}
