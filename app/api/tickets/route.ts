import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { withApiTiming } from "@/lib/api-timing";
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
  const startedAt = performance.now();

  try {
    const user = await getSessionUser();

    if (!user) {
      return withApiTiming(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        startedAt,
        "/api/tickets",
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const departmentId = searchParams.get("departmentId");
    const requestedPage = Number(searchParams.get("page"));
    const requestedPageSize = Number(searchParams.get("pageSize"));
    const paginated = Number.isFinite(requestedPage) && requestedPage > 0;
    const page = paginated ? Math.floor(requestedPage) : 1;
    const pageSize = paginated
      ? Math.min(Math.max(Math.floor(requestedPageSize) || 25, 1), 100)
      : undefined;

    const where: {
      requesterId?: string;
      OR?: Array<{ assigneeId?: string; departmentId?: string }>;
      status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
      priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      departmentId?: string;
    } = {};

    // Filter based on user role - STRICT "own portal only" rules
    if (user.role === "EMPLOYEE") {
      // Employees see ONLY tickets they created
      where.requesterId = user.id;
    } else if (user.role === "AGENT") {
      // Agents see ONLY tickets assigned to them
      where.assigneeId = user.id;
    }
    // ADMIN sees all tickets (no filter)

    if (
      status &&
      ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].includes(status)
    ) {
      where.status = status as NonNullable<typeof where.status>;
    }
    if (priority && ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(priority)) {
      where.priority = priority as NonNullable<typeof where.priority>;
    }
    if (departmentId) where.departmentId = departmentId;

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          priority: true,
          category: { select: { id: true, name: true } },
          department: { select: { id: true, name: true } },
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
          createdAt: true,
          updatedAt: true,
          closedAt: true,
          _count: { select: { comments: true } },
        },
        orderBy: { createdAt: "desc" },
        ...(pageSize ? { skip: (page - 1) * pageSize, take: pageSize } : {}),
      }),
      pageSize ? prisma.ticket.count({ where }) : Promise.resolve(0),
    ]);

    const response = paginated
      ? NextResponse.json({
        data: tickets,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize!),
        },
      })
      : NextResponse.json(tickets);

    return withApiTiming(response, startedAt, "/api/tickets");
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return withApiTiming(
      NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 }),
      startedAt,
      "/api/tickets",
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
        return NextResponse.json(
          { error: "Requester not found" },
          { status: 404 },
        );
      }
      requesterId = requester.id;
    }

    if (user.role === "EMPLOYEE" && requesterId !== user.id) {
      return NextResponse.json(
        { error: "Employees can only create their own tickets" },
        { status: 403 },
      );
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
