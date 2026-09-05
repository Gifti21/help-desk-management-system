import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { developmentOnly } from "@/lib/development-only";

/**
 * GET /api/test/tickets - Get all tickets (NO AUTH - For testing only)
 */
export async function GET() {
  const blocked = developmentOnly();
  if (blocked) return blocked;
  try {
    const tickets = await prisma.ticket.findMany({
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
    });

    return NextResponse.json({
      success: true,
      count: tickets.length,
      data: tickets,
    });
  } catch (error) {
    console.error("GET /api/test/tickets error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 },
    );
  }
}
