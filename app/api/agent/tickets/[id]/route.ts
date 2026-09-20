import { NextRequest } from "next/server";
import { TicketController } from "@/src/modules/tickets/ticket.controller";

const controller = new TicketController();

/**
 * GET /api/agent/tickets/[id] - Get specific ticket (Agent only)
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    return controller.getById(request, id);
}

/**
 * PATCH /api/agent/tickets/[id] - Update assigned ticket (Agent only)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    return controller.update(request, id);
}
