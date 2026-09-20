import { NextRequest } from "next/server";
import { TicketController } from "@/src/modules/tickets/ticket.controller";

const controller = new TicketController();

/**
 * GET /api/agent/tickets - Get agent's assigned tickets (Agent only)
 */
export async function GET(request: NextRequest) {
    return controller.getAll(request);
}
