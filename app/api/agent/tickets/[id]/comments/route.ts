import { NextRequest, NextResponse } from "next/server";
import {
    requireAuth,
    requireRole,
    handleApiError,
    canViewTicket,
    ForbiddenError,
} from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createTicketNotifications } from "@/lib/notifications";
import { validateBody, errorResponse, successResponse } from "@/lib/api-helpers";

const commentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty").max(2000),
});

/**
 * GET /api/agent/tickets/[id]/comments - Get ticket comments (Agent only, must be assigned)
 */
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    try {
        const user = await requireAuth();
        requireRole(user, "AGENT");

        const { id } = await context.params;

        // Verify ticket exists and agent has access
        const ticket = await prisma.ticket.findUnique({
            where: { id },
            select: { requesterId: true, assigneeId: true },
        });

        if (!ticket) {
            return errorResponse("Ticket not found", 404);
        }

        if (!canViewTicket(user, ticket)) {
            throw new ForbiddenError("You can only view tickets assigned to you");
        }

        const comments = await prisma.comment.findMany({
            where: { ticketId: id },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: { createdAt: "asc" },
        });

        return successResponse(comments);
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * POST /api/agent/tickets/[id]/comments - Add comment to ticket (Agent only, must be assigned)
 */
export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    try {
        const user = await requireAuth();
        requireRole(user, "AGENT");

        const { id } = await context.params;

        const validation = await validateBody(req, commentSchema);
        if (validation.error) return validation.error;
        const { content } = validation.data;

        // Verify ticket exists and agent has access
        const ticket = await prisma.ticket.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                requesterId: true,
                assigneeId: true,
            },
        });

        if (!ticket) {
            return errorResponse("Ticket not found", 404);
        }

        if (!canViewTicket(user, ticket)) {
            throw new ForbiddenError("You can only comment on tickets assigned to you");
        }

        const comment = await prisma.$transaction(async (tx) => {
            const newComment = await tx.comment.create({
                data: {
                    content,
                    ticketId: id,
                    authorId: user.id,
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            });

            // Notify requester about the comment
            await createTicketNotifications(tx, {
                ticketId: id,
                title: ticket.title,
                requesterId: ticket.requesterId,
                assigneeId: ticket.assigneeId,
                actorId: user.id,
                type: "TICKET_COMMENT",
                message: `${user.firstName} ${user.lastName} commented on ${ticket.title}.`,
            });

            return newComment;
        });

        return NextResponse.json(
            { success: true, data: comment },
            { status: 201 },
        );
    } catch (error) {
        return handleApiError(error);
    }
}
