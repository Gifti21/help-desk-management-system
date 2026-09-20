import { NextRequest } from "next/server";
import { TicketController } from "@/src/modules/tickets/ticket.controller";

const controller = new TicketController();

// GET /api/tickets/[id] - Get a specific ticket
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return controller.getById(req, id);
}

// PATCH /api/tickets/[id] - Update a ticket
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return controller.update(req, id);
}

// DELETE /api/tickets/[id] - Delete a ticket (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return controller.delete(req, id);
}
