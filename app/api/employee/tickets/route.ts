import { NextRequest } from "next/server";
import { TicketController } from "@/src/modules/tickets/ticket.controller";

const controller = new TicketController();

/**
 * GET /api/employee/tickets - Get employee's tickets (Employee only)
 */
export async function GET(request: NextRequest) {
  return controller.getTicketsForEmployee(request);
}

/**
 * POST /api/employee/tickets - Create new ticket (Employee only)
 */
export async function POST(request: NextRequest) {
  return controller.createTicketForEmployee(request);
}
