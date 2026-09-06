import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createTicketNotifications } from "@/lib/notifications";

const commentSchema = z.object({
  content: z.string().min(1),
});

// GET /api/tickets/[id]/comments - Get all comments for a ticket
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
      select: { title: true, requesterId: true, assigneeId: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const accessible = await prisma.ticket.findUnique({
      where: { id },
      select: { requesterId: true, assigneeId: true, departmentId: true },
    });

    if (
      !accessible ||
      (user.role === "EMPLOYEE" && accessible.requesterId !== user.id) ||
      (user.role === "AGENT" &&
        accessible.assigneeId !== user.id &&
        accessible.departmentId !== user.departmentId)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 },
    );
  }
}

// POST /api/tickets/[id]/comments - Add a comment to a ticket
export async function POST(
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
      select: { requesterId: true },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (user.role === "EMPLOYEE" && ticket.requesterId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (
      user.role === "AGENT" &&
      ticket.requesterId !== user.id &&
      !(await prisma.ticket.findFirst({
        where: {
          id,
          OR: [{ assigneeId: user.id }, { departmentId: user.departmentId }],
        },
        select: { id: true },
      }))
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = commentSchema.parse(body);

    const comment = await prisma.$transaction(async (tx) => {
      const createdComment = await tx.comment.create({
        data: {
          ...validatedData,
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
            },
          },
        },
      });

      await createTicketNotifications(tx, {
        ticketId: id,
        title: ticket.title,
        requesterId: ticket.requesterId,
        assigneeId: ticket.assigneeId,
        actorId: user.id,
        type: "TICKET_COMMENT",
        message: `A new comment was added to ${ticket.title}.`,
      });

      return createdComment;
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 },
    );
  }
}
