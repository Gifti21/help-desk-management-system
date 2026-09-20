import { NextRequest } from "next/server";
import { CommentController } from "@/src/modules/comments/comment.controller";

const controller = new CommentController();

// GET /api/tickets/[id]/comments - Get all comments for a ticket
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return controller.getByTicketId(req, id);
}

// POST /api/tickets/[id]/comments - Create a new comment
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return controller.create(req, id);
}
