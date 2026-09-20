import { NextRequest } from "next/server";
import { ProfileController } from "@/src/modules/profile/profile.controller";

const controller = new ProfileController();

/**
 * GET /api/admin/profile - Get current admin's profile
 */
export async function GET(request: NextRequest) {
  return controller.getProfile(request);
}

/**
 * PATCH /api/admin/profile - Update current admin's profile
 */
export async function PATCH(request: NextRequest) {
  return controller.updateProfile(request);
}
