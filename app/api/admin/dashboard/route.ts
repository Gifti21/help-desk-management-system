import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/dashboard - Get dashboard statistics (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    // Get all statistics in parallel for performance
    const [
      totalTickets,
      openTickets,
      closedToday,
      overdueTickets,
      ticketsByStatus,
      ticketsByDepartment,
      recentTickets,
      monthlyTickets,
    ] = await Promise.all([
      // Total tickets count
      prisma.ticket.count(),

      // Open tickets count
      prisma.ticket.count({
        where: { status: "OPEN" },
      }),

      // Closed today count
      prisma.ticket.count({
        where: {
          status: "CLOSED",
          updatedAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),

      // Overdue tickets (OPEN or IN_PROGRESS created more than 7 days ago)
      prisma.ticket.count({
        where: {
          status: {
            in: ["OPEN", "IN_PROGRESS"],
          },
          createdAt: {
            lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),

      // Tickets by status for pie chart
      prisma.ticket.groupBy({
        by: ["status"],
        _count: { id: true },
      }),

      // Tickets by department for bar chart
      prisma.ticket.groupBy({
        by: ["departmentId"],
        _count: { id: true },
      }),

      // Recent tickets for the table
      prisma.ticket.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        include: {
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
        },
      }),

      // Monthly tickets for line chart (last 5 months)
      Promise.all(
        Array.from({ length: 5 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (4 - i));
          const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
          const endOfMonth = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0,
            23,
            59,
            59,
          );

          return prisma.ticket.count({
            where: {
              createdAt: {
                gte: startOfMonth,
                lte: endOfMonth,
              },
            },
          });
        }),
      ),
    ]);

    // Get department names
    const departments = await prisma.department.findMany({
      select: { id: true, name: true },
    });
    const departmentMap = Object.fromEntries(
      departments.map((d) => [d.id, d.name]),
    );

    // Format tickets by department
    const ticketsByDepartmentWithNames = ticketsByDepartment.map((item) => ({
      department: departmentMap[item.departmentId] || "Unknown",
      count: item._count.id,
    }));

    // Get month names for the chart
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentDate = new Date();
    const monthLabels = Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (4 - i));
      return monthNames[date.getMonth()];
    });

    // Calculate resolved, active, overdue for pie chart using real Prisma status values
    const resolvedCount =
      ticketsByStatus.find((s) => s.status === "RESOLVED")?._count.id || 0;
    const closedCount =
      ticketsByStatus.find((s) => s.status === "CLOSED")?._count.id || 0;
    const inProgressCount =
      ticketsByStatus.find((s) => s.status === "IN_PROGRESS")?._count.id || 0;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalTickets,
          openTickets,
          closedToday,
          overdueTickets,
        },
        charts: {
          ticketsByStatus: {
            resolved: resolvedCount + closedCount,
            active: inProgressCount + openTickets,
            overdue: overdueTickets,
          },
          ticketsByDepartment: ticketsByDepartmentWithNames,
          monthlyTickets: {
            labels: monthLabels,
            data: monthlyTickets,
          },
        },
        recentTickets,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}
