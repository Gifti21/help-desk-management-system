import { NextRequest } from "next/server";
import { TicketController } from "@/src/modules/tickets/ticket.controller";

const controller = new TicketController();

/**
 * GET /api/admin/tickets/[id] - Get single ticket (Admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return controller.getById(request, id);
}

/**
 * PATCH /api/admin/tickets/[id] - Update ticket (Admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return controller.update(request, id);
}

/**
 * DELETE /api/admin/tickets/[id] - Delete ticket (Admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return controller.delete(request, id);
}
