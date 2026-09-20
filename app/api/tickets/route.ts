import { NextRequest } from "next/server";
import { TicketController } from "@/src/modules/tickets/ticket.controller";

const controller = new TicketController();

// GET /api/tickets - Get all tickets (filtered by user role)
export async function GET(req: NextRequest) {
  return controller.getAll(req);
}

// POST /api/tickets - Create a new ticket
export async function POST(req: NextRequest) {
  return controller.create(req);
}
