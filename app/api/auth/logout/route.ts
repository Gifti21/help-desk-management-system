import { NextRequest } from "next/server";
import { AuthController } from "@/src/modules/auth/auth.controller";

const controller = new AuthController();

/**
 * POST /api/auth/logout - Logout user
 */
export async function POST(request: NextRequest) {
  return controller.logout(request);
}
