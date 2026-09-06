import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { canTransitionStatus, isActiveAgent } from "@/lib/ticket-rules";
import { createTicketNotifications } from "@/lib/notifications";

const updateTicketSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  assigneeId: z.string().nullable().optional(),
  categoryId: z.string().optional(),
  departmentId: z.string().optional(),
});

// GET /api/tickets/[id] - Get a specific ticket
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    const { id } = await params;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Check access permissions - STRICT "own portal only" rules
    const canAccess =
      user.role === "ADMIN" ||
      (user.role === "EMPLOYEE" && ticket.requesterId === user.id) ||
      (user.role === "AGENT" && ticket.assigneeId === user.id);

    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "Failed to fetch ticket" },
      { status: 500 },
    );
  }
}

// PATCH /api/tickets/[id] - Update a ticket
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    const { id } = await params;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = updateTicketSchema.parse(body);

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (user.role === "EMPLOYEE" && ticket.requesterId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (user.role === "EMPLOYEE" && ticket.status === "CLOSED") {
      return NextResponse.json(
        { error: "Closed tickets can only be edited by an admin" },
        { status: 403 },
      );
    }

    if (user.role === "AGENT" && ticket.assigneeId !== user.id) {
      return NextResponse.json(
        { error: "Only the assigned agent can update this ticket" },
        { status: 403 },
      );
    }

    if (
      validatedData.status &&
      !canTransitionStatus(ticket.status, validatedData.status, user.role)
    ) {
      return NextResponse.json(
        {
          error: `Invalid status transition from ${ticket.status} to ${validatedData.status}`,
        },
        { status: 409 },
      );
    }

    if (user.role !== "ADMIN" && validatedData.assigneeId !== undefined) {
      return NextResponse.json(
        { error: "Only admins can assign tickets" },
        { status: 403 },
      );
    }

    if (user.role === "ADMIN" && validatedData.assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: validatedData.assigneeId },
        select: { role: true, isActive: true },
      });
      if (!assignee || !isActiveAgent(assignee.role, assignee.isActive)) {
        return NextResponse.json(
          { error: "Tickets can only be assigned to active agents" },
          { status: 400 },
        );
      }
    }

    if (
      user.role === "EMPLOYEE" &&
      (validatedData.status !== undefined ||
        validatedData.assigneeId !== undefined ||
        validatedData.departmentId !== undefined)
    ) {
      return NextResponse.json(
        { error: "Employees cannot change ticket workflow fields" },
        { status: 403 },
      );
    }

    if (
      user.role === "AGENT" &&
      validatedData.status === "OPEN" &&
      ticket.status === "CLOSED"
    ) {
      return NextResponse.json(
        { error: "Only admins can reopen closed tickets" },
        { status: 403 },
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

      if (
        validatedData.assigneeId !== undefined &&
        validatedData.assigneeId !== ticket.assigneeId
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

    return NextResponse.json(updatedTicket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Failed to update ticket" },
      { status: 500 },
    );
  }
}

// DELETE /api/tickets/[id] - Delete a ticket (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getSessionUser();
    const { id } = await params;

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.ticket.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Ticket deleted" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { error: "Failed to delete ticket" },
      { status: 500 },
    );
  }
}
