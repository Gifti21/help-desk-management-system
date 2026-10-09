import { NextRequest } from "next/server";
import { AuthController } from "@/src/modules/auth/auth.controller";

export const runtime = "nodejs";

const controller = new AuthController();

export async function POST(request: NextRequest) {
  return controller.login(request);
}
