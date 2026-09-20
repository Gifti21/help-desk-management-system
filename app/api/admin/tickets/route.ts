import { NextRequest } from "next/server";
import { TicketController } from "@/src/modules/tickets/ticket.controller";

const controller = new TicketController();

/**
 * GET /api/admin/tickets - Get all tickets (Admin only)
 */
export async function GET(request: NextRequest) {
  return controller.getAll(request);
}

/**
 * POST /api/admin/tickets - Create a new ticket (Admin only)
 */
export async function POST(request: NextRequest) {
  return controller.create(request);
}
