import { NextRequest } from "next/server";
import { AuthController } from "@/src/modules/auth/auth.controller";

const controller = new AuthController();

export async function POST(request: NextRequest) {
  return controller.login(request);
}
