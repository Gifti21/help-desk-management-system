import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { withApiTiming } from "@/lib/api-timing";

/**
 * GET /api/admin/reports - Get comprehensive system statistics (Admin only)
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

    // Get comprehensive statistics in parallel
    const [
      totalTickets,
      totalUsers,
      totalDepartments,
      totalCategories,
      ticketsByStatus,
      ticketsByPriority,
      ticketsByDepartment,
      ticketsByCategory,
      usersByRole,
      usersByDepartment,
      recentTickets,
      topCategories,
      departmentPerformance,
    ] = await Promise.all([
      // Total counts
      prisma.ticket.count(),
      prisma.user.count(),
      prisma.department.count(),
      prisma.category.count(),

      // Tickets by status
      prisma.ticket.groupBy({
        by: ["status"],
        _count: { id: true },
      }),

      // Tickets by priority
      prisma.ticket.groupBy({
        by: ["priority"],
        _count: { id: true },
      }),

      // Tickets by department
      prisma.ticket.groupBy({
        by: ["departmentId"],
        _count: { id: true },
      }),

      // Tickets by category
      prisma.ticket.groupBy({
        by: ["categoryId"],
        _count: { id: true },
      }),

      // Users by role
      prisma.user.groupBy({
        by: ["role"],
        _count: { id: true },
      }),

      // Users by department
      prisma.user.groupBy({
        by: ["departmentId"],
        _count: { id: true },
      }),

      // Recent tickets (last 10)
      prisma.ticket.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true } },
          department: { select: { name: true } },
          requester: { select: { firstName: true, lastName: true } },
          assignee: { select: { firstName: true, lastName: true } },
        },
      }),

      // Top categories by ticket count
      prisma.category.findMany({
        include: {
          _count: {
            select: { tickets: true },
          },
        },
        orderBy: {
          tickets: {
            _count: "desc",
          },
        },
        take: 5,
      }),

      // Department performance
      prisma.department.findMany({
        include: {
          _count: {
            select: {
              tickets: true,
              users: true,
            },
          },
        },
      }),
    ]);

    // Get department and category names for the grouped data
    const departments = await prisma.department.findMany({
      select: { id: true, name: true },
    });
    const categories = await prisma.category.findMany({
      select: { id: true, name: true },
    });

    // Map department IDs to names
    const departmentMap = Object.fromEntries(
      departments.map((d) => [d.id, d.name]),
    );
    const categoryMap = Object.fromEntries(
      categories.map((c) => [c.id, c.name]),
    );

    // Format the data
    const ticketsByDepartmentWithNames = ticketsByDepartment.map((item) => ({
      department: departmentMap[item.departmentId] || "Unknown",
      count: item._count.id,
    }));

    const ticketsByCategoryWithNames = ticketsByCategory.map((item) => ({
      category: categoryMap[item.categoryId] || "Unknown",
      count: item._count.id,
    }));

    return withApiTiming(
      NextResponse.json({
        success: true,
        data: {
          overview: {
            totalTickets,
            totalUsers,
            totalDepartments,
            totalCategories,
            openTickets:
              ticketsByStatus.find((s) => s.status === "OPEN")?._count.id || 0,
            inProgressTickets:
              ticketsByStatus.find((s) => s.status === "IN_PROGRESS")?._count
                .id || 0,
            resolvedTickets:
              ticketsByStatus.find((s) => s.status === "RESOLVED")?._count.id ||
              0,
            closedTickets:
              ticketsByStatus.find((s) => s.status === "CLOSED")?._count.id ||
              0,
          },
          ticketsByStatus: ticketsByStatus.map((item) => ({
            status: item.status,
            count: item._count.id,
          })),
          ticketsByPriority: ticketsByPriority.map((item) => ({
            priority: item.priority,
            count: item._count.id,
          })),
          ticketsByDepartment: ticketsByDepartmentWithNames,
          ticketsByCategory: ticketsByCategoryWithNames,
          usersByRole: usersByRole.map((item) => ({
            role: item.role,
            count: item._count.id,
          })),
          usersByDepartment: usersByDepartment.map((item) => ({
            department: departmentMap[item.departmentId] || "Unknown",
            count: item._count.id,
          })),
          recentTickets,
          topCategories: topCategories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            ticketCount: cat._count.tickets,
          })),
          departmentPerformance: departmentPerformance.map((dept) => ({
            id: dept.id,
            name: dept.name,
            ticketCount: dept._count.tickets,
            userCount: dept._count.users,
          })),
        },
      }),
      startedAt,
      "/api/admin/reports",
    );
  } catch (error) {
    console.error("GET /api/admin/reports error:", error);
    return withApiTiming(
      NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 }),
      startedAt,
      "/api/admin/reports",
    );
  }
}
