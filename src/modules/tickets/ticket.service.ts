import { TicketRepository } from "./ticket.repository";
import { CreateTicketDto, UpdateTicketDto, TicketFilters } from "./ticket.dto";
import { TicketPolicy } from "./ticket.policy";
import { SessionUser } from "@/src/infrastructure/authentication/session";
import {
    ForbiddenError,
    NotFoundError,
    ValidationError,
} from "@/src/shared/errors/AppError";
import { prisma } from "@/src/infrastructure/database/prisma";
import { createTicketNotifications } from "@/lib/notifications";

export class TicketService {
    private repository: TicketRepository;

    constructor() {
        this.repository = new TicketRepository();
    }

    async getAllTickets(
        user: SessionUser,
        filters: TicketFilters,
        page?: number,
        pageSize?: number,
    ) {
        // Apply role-based filtering
        const roleFilter = TicketPolicy.getFilterForRole(user);
        const combinedFilters = { ...filters, ...roleFilter };

        if (pageSize) {
            const [tickets, total] = await Promise.all([
                this.repository.findAll(combinedFilters, page, pageSize),
                this.repository.count(combinedFilters),
            ]);
            return { tickets, total };
        }

        const tickets = await this.repository.findAll(combinedFilters);
        return { tickets, total: tickets.length };
    }

    async getTicketById(id: string, user: SessionUser) {
        const ticket = await this.repository.findById(id, true);

        if (!ticket) {
            throw new NotFoundError("Ticket not found");
        }

        // Check access permissions
        if (!TicketPolicy.canView(user, ticket)) {
            throw new ForbiddenError("Access denied");
        }

        return ticket;
    }

    async createTicket(dto: CreateTicketDto, user: SessionUser) {
        let requesterId = dto.requesterId || user.id;

        // Handle requester email
        if (dto.requesterEmail) {
            const requester = await this.repository.findUserByEmail(
                dto.requesterEmail,
            );
            if (!requester) {
                throw new NotFoundError("Requester not found");
            }
            requesterId = requester.id;
        }

        // Check if employee is creating for themselves
        if (user.role === "EMPLOYEE" && requesterId !== user.id) {
            throw new ForbiddenError("Employees can only create their own tickets");
        }

        return await this.repository.create({
            title: dto.title,
            description: dto.description,
            category: { connect: { id: dto.categoryId } },
            department: { connect: { id: dto.departmentId } },
            priority: dto.priority,
            requester: { connect: { id: requesterId } },
        });
    }

    async updateTicket(id: string, dto: UpdateTicketDto, user: SessionUser) {
        const ticket = await this.repository.findById(id);

        if (!ticket) {
            throw new NotFoundError("Ticket not found");
        }

        // Check if user can update
        if (!TicketPolicy.canUpdate(user, ticket)) {
            if (user.role === "EMPLOYEE" && ticket.status === "CLOSED") {
                throw new ForbiddenError(
                    "Closed tickets can only be edited by an admin",
                );
            }
            if (user.role === "AGENT") {
                throw new ForbiddenError(
                    "Only the assigned agent can update this ticket",
                );
            }
            throw new ForbiddenError("Access denied");
        }

        // Validate status transition
        if (dto.status && !TicketPolicy.canTransitionStatus(ticket.status, dto.status, user.role)) {
            throw new ValidationError(
                `Invalid status transition from ${ticket.status} to ${dto.status}`,
            );
        }

        // Check assignment permissions
        if (dto.assigneeId !== undefined && !TicketPolicy.canAssign(user)) {
            throw new ForbiddenError("Only admins can assign tickets");
        }

        // Validate assignee
        if (user.role === "ADMIN" && dto.assigneeId) {
            const assignee = await this.repository.findUserById(dto.assigneeId);
            if (
                !assignee ||
                !TicketPolicy.isActiveAgent(assignee.role, assignee.isActive)
            ) {
                throw new ValidationError(
                    "Tickets can only be assigned to active agents",
                );
            }
        }

        // Employee restrictions
        if (
            user.role === "EMPLOYEE" &&
            (dto.status !== undefined ||
                dto.assigneeId !== undefined ||
                dto.departmentId !== undefined)
        ) {
            throw new ForbiddenError(
                "Employees cannot change ticket workflow fields",
            );
        }

        // Agent reopen restriction
        if (
            user.role === "AGENT" &&
            dto.status === "OPEN" &&
            ticket.status === "CLOSED"
        ) {
            throw new ForbiddenError("Only admins can reopen closed tickets");
        }

        const updateData: any = { ...dto };

        // Handle closedAt
        if (dto.status === "CLOSED" && ticket.status !== "CLOSED") {
            updateData.closedAt = new Date();
        } else if (dto.status && dto.status !== "CLOSED") {
            updateData.closedAt = null;
        }

        // Update with notifications in transaction
        return await prisma.$transaction(async (tx) => {
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
            try {
                if (
                    dto.assigneeId !== undefined &&
                    dto.assigneeId !== ticket.assigneeId
                ) {
                    await createTicketNotifications(tx, {
                        ticketId: id,
                        title: updated.title,
                        requesterId: updated.requesterId,
                        assigneeId: updated.assigneeId,
                        actorId: user.id,
                        type: "TICKET_ASSIGNED",
                        message: updated.assigneeId
                            ? `${updated.title} was assigned to you.`
                            : `${updated.title} is now unassigned.`,
                    });
                }

                if (dto.status && dto.status !== ticket.status) {
                    const type =
                        dto.status === "CLOSED"
                            ? "TICKET_CLOSED"
                            : "TICKET_STATUS_CHANGED";
                    await createTicketNotifications(tx, {
                        ticketId: id,
                        title: updated.title,
                        requesterId: updated.requesterId,
                        assigneeId: updated.assigneeId,
                        actorId: user.id,
                        type,
                        message: `${updated.title} status changed to ${dto.status}.`,
                    });
                }

                if (dto.priority && dto.priority !== ticket.priority) {
                    await createTicketNotifications(tx, {
                        ticketId: id,
                        title: updated.title,
                        requesterId: updated.requesterId,
                        assigneeId: updated.assigneeId,
                        actorId: user.id,
                        type: "TICKET_PRIORITY_CHANGED",
                        message: `${updated.title} priority changed to ${dto.priority}.`,
                    });
                }
            } catch (notifError) {
                console.warn("Failed to create notification:", notifError);
            }

            return updated;
        });
    }

    async deleteTicket(id: string, user: SessionUser) {
        if (!TicketPolicy.canDelete(user)) {
            throw new ForbiddenError("Only admins can delete tickets");
        }

        const ticket = await this.repository.findById(id);
        if (!ticket) {
            throw new NotFoundError("Ticket not found");
        }

        return await this.repository.delete(id);
    }

    async getEmployeeTickets(
        employeeId: string,
        filters: TicketFilters,
        page?: number,
        pageSize?: number,
    ) {
        // Force requester filter for employee
        const employeeFilters = { ...filters, requesterId: employeeId };

        if (pageSize) {
            const [tickets, total] = await Promise.all([
                this.repository.findAll(employeeFilters, page, pageSize),
                this.repository.count(employeeFilters),
            ]);
            return { tickets, total };
        }

        const tickets = await this.repository.findAll(employeeFilters);
        return { tickets, total: tickets.length };
    }

    async createEmployeeTicket(dto: CreateTicketDto, user: SessionUser) {
        // Employee must have a department
        if (!user.departmentId) {
            throw new ValidationError("Employee must be assigned to a department");
        }

        // Employee creates ticket for themselves in their department
        return await this.repository.create({
            title: dto.title,
            description: dto.description,
            category: { connect: { id: dto.categoryId } },
            department: { connect: { id: user.departmentId } },
            priority: dto.priority,
            status: "OPEN",
            requester: { connect: { id: user.id } },
        });
    }
}
