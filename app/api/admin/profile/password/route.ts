import { NextRequest } from "next/server";
import { ProfileController } from "@/src/modules/profile/profile.controller";

const controller = new ProfileController();

/**
 * POST /api/admin/profile/password - Change admin password
 */
export async function POST(request: NextRequest) {
    return controller.changePassword(request);
}
