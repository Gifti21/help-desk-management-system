import { CommentRepository } from "./comment.repository";
import { CreateCommentDto } from "./comment.dto";
import { SessionUser } from "@/src/infrastructure/authentication/session";
import { NotFoundError, ForbiddenError } from "@/src/shared/errors/AppError";
import { prisma } from "@/src/infrastructure/database/prisma";
import { createTicketNotifications } from "@/lib/notifications";

export class CommentService {
    private repository: CommentRepository;

    constructor() {
        this.repository = new CommentRepository();
    }

    async getCommentsByTicketId(ticketId: string, user: SessionUser) {
        // Verify ticket exists and user has access
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            select: { requesterId: true, assigneeId: true },
        });

        if (!ticket) {
            throw new NotFoundError("Ticket not found");
        }

        // Check access based on role
        const hasAccess =
            user.role === "ADMIN" ||
            (user.role === "EMPLOYEE" && ticket.requesterId === user.id) ||
            (user.role === "AGENT" && ticket.assigneeId === user.id);

        if (!hasAccess) {
            throw new ForbiddenError("Access denied");
        }

        return await this.repository.findByTicketId(ticketId);
    }

    async createComment(dto: CreateCommentDto, user: SessionUser) {
        // Verify ticket exists and user has access
        const ticket = await prisma.ticket.findUnique({
            where: { id: dto.ticketId },
            select: {
                id: true,
                title: true,
                requesterId: true,
                assigneeId: true,
            },
        });

        if (!ticket) {
            throw new NotFoundError("Ticket not found");
        }

        const hasAccess =
            user.role === "ADMIN" ||
            (user.role === "EMPLOYEE" && ticket.requesterId === user.id) ||
            (user.role === "AGENT" && ticket.assigneeId === user.id);

        if (!hasAccess) {
            throw new ForbiddenError("Access denied");
        }

        // Create comment with notification in transaction
        return await prisma.$transaction(async (tx) => {
            const comment = await tx.comment.create({
                data: {
                    content: dto.content,
                    ticket: { connect: { id: dto.ticketId } },
                    author: { connect: { id: user.id } },
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            });

            // Create notification
            try {
                await createTicketNotifications(tx, {
                    ticketId: dto.ticketId,
                    title: ticket.title,
                    requesterId: ticket.requesterId,
                    assigneeId: ticket.assigneeId,
                    actorId: user.id,
                    type: "TICKET_COMMENT",
                    message: `New comment added to ${ticket.title}`,
                });
            } catch (notifError) {
                console.warn("Failed to create comment notification:", notifError);
            }

            return comment;
        });
    }

    async getCommentsForAgent(ticketId: string, user: SessionUser) {
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            select: { assigneeId: true },
        });

        if (!ticket) {
            throw new NotFoundError("Ticket not found");
        }

        if (ticket.assigneeId !== user.id) {
            throw new ForbiddenError("You can only view tickets assigned to you");
        }

        return await this.repository.findByTicketId(ticketId);
    }

    async createCommentForAgent(dto: CreateCommentDto, user: SessionUser) {
        const ticket = await prisma.ticket.findUnique({
            where: { id: dto.ticketId },
            select: {
                id: true,
                title: true,
                requesterId: true,
                assigneeId: true,
            },
        });

        if (!ticket) {
            throw new NotFoundError("Ticket not found");
        }

        if (ticket.assigneeId !== user.id) {
            throw new ForbiddenError("You can only comment on tickets assigned to you");
        }

        return await prisma.$transaction(async (tx) => {
            const comment = await tx.comment.create({
                data: {
                    content: dto.content,
                    ticket: { connect: { id: dto.ticketId } },
                    author: { connect: { id: user.id } },
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

            try {
                await createTicketNotifications(tx, {
                    ticketId: dto.ticketId,
                    title: ticket.title,
                    requesterId: ticket.requesterId,
                    assigneeId: ticket.assigneeId,
                    actorId: user.id,
                    type: "TICKET_COMMENT",
                    message: `${user.firstName} ${user.lastName} commented on ${ticket.title}.`,
                });
            } catch (notifError) {
                console.warn("Failed to create notification:", notifError);
            }

            return comment;
        });
    }
}
