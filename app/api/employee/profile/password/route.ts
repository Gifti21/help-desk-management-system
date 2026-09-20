import { NextRequest } from "next/server";
import { ProfileController } from "@/src/modules/profile/profile.controller";

const controller = new ProfileController();

/**
 * PATCH /api/employee/profile/password - Change employee password
 */
export async function PATCH(request: NextRequest) {
  return controller.changePassword(request);
}
