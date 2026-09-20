import { NextRequest } from "next/server";
import { AuthController } from "@/src/modules/auth/auth.controller";

const controller = new AuthController();

/**
 * GET /api/auth/me - Get current user
 */
export async function GET(request: NextRequest) {
  return controller.me(request);
}
