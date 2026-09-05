import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ticketSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string(),
  departmentId: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  requesterId: z.string().optional(),
  requesterEmail: z.string().email().optional(),
});

// GET /api/tickets - Get all tickets (filtered by user role)
export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const departmentId = searchParams.get("departmentId");

    const where: any = {};

    // Filter based on user role
    if (user.role === "EMPLOYEE") {
      where.requesterId = user.id;
    } else if (user.role === "AGENT") {
      where.OR = [{ assigneeId: user.id }, { departmentId: user.departmentId }];
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (departmentId) where.departmentId = departmentId;

    const tickets = await prisma.ticket.findMany({
      where,
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 },
    );
  }
}

// POST /api/tickets - Create a new ticket
export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = ticketSchema.parse(body);

    let requesterId = validatedData.requesterId || user.id;
    if (validatedData.requesterEmail) {
      const requester = await prisma.user.findUnique({
        where: { email: validatedData.requesterEmail.toLowerCase() },
        select: { id: true },
      });
      if (!requester) {
        return NextResponse.json({ error: "Requester not found" }, { status: 404 });
      }
      requesterId = requester.id;
    }

    if (user.role === "EMPLOYEE" && requesterId !== user.id) {
      return NextResponse.json({ error: "Employees can only create their own tickets" }, { status: 403 });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        categoryId: validatedData.categoryId,
        departmentId: validatedData.departmentId,
        priority: validatedData.priority,
        requesterId,
      },
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
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 },
    );
  }
}
