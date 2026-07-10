import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ticketSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string(),
  departmentId: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
});

// GET /api/tickets - Get all tickets (filtered by user role)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const departmentId = searchParams.get("departmentId");

    const where: any = {};

    // Filter based on user role
    if (session.user.role === "EMPLOYEE") {
      where.requesterId = session.user.id;
    } else if (session.user.role === "AGENT") {
      where.OR = [
        { assigneeId: session.user.id },
        { departmentId: session.user.departmentId }
      ];
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
            email: true
          }
        },
        assignee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          },
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

// POST /api/tickets - Create a new ticket
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = ticketSchema.parse(body);

    const ticket = await prisma.ticket.create({
      data: {
        ...validatedData,
        requesterId: session.user.id
      },
      include: {
        category: true,
        department: true,
        requester: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
    }
    console.error("Error creating ticket:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
