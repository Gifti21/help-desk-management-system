import { NextRequest, NextResponse } from "next/server";
import {
    requireAuth,
    requireRole,
    handleApiError,
    canViewTicket,
    canUpdateTicket,
    ForbiddenError,
} from "@/lib/rbac";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { canTransitionStatus } from "@/lib/ticket-rules";
import { createTicketNotifications } from "@/lib/notifications";
import { validateBody, errorResponse } from "@/lib/api-helpers";

const updateTicketSchema = z.object({
    status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
});

/**
 * GET /api/agent/tickets/[id] - Get specific ticket (Agent only, must be assigned)
 */
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    try {
        const user = await requireAuth();
        requireRole(user, "AGENT");

        const { id } = await context.params;

        const ticket = await prisma.ticket.findUnique({
            where: { id },
            include: {
                category: true,
                department: true,
                requester: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "asc" },
                },
            },
        });

        if (!ticket) {
            return errorResponse("Ticket not found", 404);
        }

        // Agent can only view tickets assigned to them
        if (!canViewTicket(user, ticket)) {
            throw new ForbiddenError(
                "You can only view tickets assigned to you",
            );
        }

        return NextResponse.json({ success: true, data: ticket });
    } catch (error) {
        return handleApiError(error);
    }
}

/**
 * PATCH /api/agent/tickets/[id] - Update assigned ticket (Agent only)
 */
export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
    try {
        const user = await requireAuth();
        requireRole(user, "AGENT");

        const { id } = await context.params;

        const validation = await validateBody(req, updateTicketSchema);
        if (validation.error) return validation.error;
        const validatedData = validation.data;

        const ticket = await prisma.ticket.findUnique({
            where: { id },
        });

        if (!ticket) {
            return errorResponse("Ticket not found", 404);
        }

        // Agent can only update tickets assigned to them
        if (!canUpdateTicket(user, ticket)) {
            throw new ForbiddenError(
                "You can only update tickets assigned to you",
            );
        }

        // Validate status transition
        if (
            validatedData.status &&
            !canTransitionStatus(ticket.status, validatedData.status, user.role)
        ) {
            return errorResponse(
                `Invalid status transition from ${ticket.status} to ${validatedData.status}`,
                409,
            );
        }

        // Agents cannot reopen closed tickets
        if (
            validatedData.status === "OPEN" &&
            ticket.status === "CLOSED"
        ) {
            return errorResponse(
                "Only admins can reopen closed tickets",
                403,
            );
        }

        const updateData: any = validatedData;

        // Set closedAt when status changes to CLOSED
        if (validatedData.status === "CLOSED" && ticket.status !== "CLOSED") {
            updateData.closedAt = new Date();
        } else if (validatedData.status && validatedData.status !== "CLOSED") {
            updateData.closedAt = null;
        }

        const updatedTicket = await prisma.$transaction(async (tx) => {
            const updated = await tx.ticket.update({
                where: { id },
                data: updateData,
                include: {
                    category: true,
                    department: true,
                    requester: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                    assignee: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            });

            // Create notifications
            if (validatedData.status && validatedData.status !== ticket.status) {
                const type =
                    validatedData.status === "CLOSED"
                        ? "TICKET_CLOSED"
                        : "TICKET_STATUS_CHANGED";
                await createTicketNotifications(tx, {
                    ticketId: id,
                    title: updated.title,
                    requesterId: updated.requesterId,
                    assigneeId: updated.assigneeId,
                    actorId: user.id,
                    type,
                    message: `${updated.title} status changed to ${validatedData.status}.`,
                });
            }

            if (
                validatedData.priority &&
                validatedData.priority !== ticket.priority
            ) {
                await createTicketNotifications(tx, {
                    ticketId: id,
                    title: updated.title,
                    requesterId: updated.requesterId,
                    assigneeId: updated.assigneeId,
                    actorId: user.id,
                    type: "TICKET_PRIORITY_CHANGED",
                    message: `${updated.title} priority changed to ${validatedData.priority}.`,
                });
            }

            return updated;
        });

        return NextResponse.json({ success: true, data: updatedTicket });
    } catch (error) {
        return handleApiError(error);
    }
}
