import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/employee/ticket-form-data - Get data needed for ticket creation form (Employee only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser();

    if (!user || user.role !== "EMPLOYEE") {
      return NextResponse.json(
        { error: "Unauthorized - Employee access required" },
        { status: 401 },
      );
    }

    const [categories, departments] = await Promise.all([
      prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.department.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        categories,
        departments,
      },
    });
  } catch (error) {
    console.error("GET /api/employee/ticket-form-data error:", error);
    return NextResponse.json(
      { error: "Failed to fetch form data" },
      { status: 500 },
    );
  }
}
