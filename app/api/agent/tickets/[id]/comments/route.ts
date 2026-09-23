import { NextRequest } from "next/server";
import { CommentController } from "@/src/modules/comments/comment.controller";

const controller = new CommentController();

/**
 * GET /api/agent/tickets/[id]/comments - Get ticket comments (Agent only, must be assigned)
 */
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const { id } = await context.params;
    return controller.getCommentsForAgent(req, id);
}

/**
 * POST /api/agent/tickets/[id]/comments - Add comment to ticket (Agent only, must be assigned)
 */
export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    const { id } = await context.params;
    return controller.createCommentForAgent(req, id);
}
