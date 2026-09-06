import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { isActiveAgent } from "@/lib/ticket-rules";
import { withApiTiming } from "@/lib/api-timing";

// Validation schema for ticket creation
const ticketCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  categoryId: z.string().min(1, "Category is required"),
  departmentId: z.string().min(1, "Department is required"),
  requesterId: z.string().min(1, "Requester is required"),
  assigneeId: z.string().min(1).optional(),
});

/**
 * GET /api/admin/tickets - Get all tickets (Admin only)
 */
export async function GET(request: NextRequest) {
  const startedAt = performance.now();

  try {
    const user = await getSessionUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const categoryId = searchParams.get("categoryId");
    const departmentId = searchParams.get("departmentId");
    const assigneeId = searchParams.get("assigneeId");
    const requestedPage = Number(searchParams.get("page"));
    const requestedPageSize = Number(searchParams.get("pageSize"));
    const paginated = Number.isFinite(requestedPage) && requestedPage > 0;
    const page = paginated ? Math.floor(requestedPage) : 1;
    const pageSize = paginated
      ? Math.min(Math.max(Math.floor(requestedPageSize) || 25, 1), 100)
      : undefined;

    // Build where clause
    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (categoryId) where.categoryId = categoryId;
    if (departmentId) where.departmentId = departmentId;
    if (assigneeId) where.assigneeId = assigneeId;

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
            },
          },
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
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        ...(pageSize ? { skip: (page - 1) * pageSize, take: pageSize } : {}),
      }),
      pageSize ? prisma.ticket.count({ where }) : Promise.resolve(0),
    ]);

    const response = paginated
      ? NextResponse.json({
          success: true,
          data: tickets,
          pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize!),
          },
        })
      : NextResponse.json({ success: true, data: tickets });

    return withApiTiming(response, startedAt, "/api/admin/tickets");
  } catch (error) {
    console.error("GET /api/admin/tickets error:", error);
    return withApiTiming(
      NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 }),
      startedAt,
      "/api/admin/tickets",
    );
  }
}

/**
 * POST /api/admin/tickets - Create a new ticket (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = ticketCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 },
      );
    }

    const {
      title,
      description,
      priority,
      categoryId,
      departmentId,
      requesterId,
      assigneeId,
    } = validation.data;

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Verify department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });
    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 },
      );
    }

    // Verify requester exists
    const requester = await prisma.user.findUnique({
      where: { id: requesterId },
    });
    if (!requester) {
      return NextResponse.json(
        { error: "Requester not found" },
        { status: 404 },
      );
    }

    // Verify assignee exists (if provided)
    if (assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: assigneeId },
      });
      if (!assignee) {
        return NextResponse.json(
          { error: "Assignee not found" },
          { status: 404 },
        );
      }
      if (!isActiveAgent(assignee.role, assignee.isActive)) {
        return NextResponse.json(
          { error: "Tickets can only be assigned to active agents" },
          { status: 400 },
        );
      }
    }

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        status: "OPEN",
        categoryId,
        departmentId,
        requesterId,
        assigneeId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
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

    return NextResponse.json(
      {
        success: true,
        data: ticket,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/admin/tickets error:", error);
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 },
    );
  }
}
