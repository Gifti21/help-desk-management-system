import { NextRequest } from "next/server";
import { ProfileController } from "@/src/modules/profile/profile.controller";

const controller = new ProfileController();

/**
 * GET /api/agent/profile - Get current agent's profile
 */
export async function GET(request: NextRequest) {
  return controller.getProfile(request);
}

/**
 * PATCH /api/agent/profile - Update current agent's profile
 */
export async function PATCH(request: NextRequest) {
  return controller.updateProfile(request);
}
