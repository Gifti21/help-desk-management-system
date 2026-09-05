import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { developmentOnly } from "@/lib/development-only";

/**
 * TEMPORARY TEST ENDPOINT - NO AUTH REQUIRED
 * GET /api/test/departments - Get all departments
 */
export async function GET() {
  const blocked = developmentOnly();
  if (blocked) return blocked;
  try {
    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            users: true,
            tickets: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: departments,
      message: "This is a test endpoint without authentication",
    });
  } catch (error: any) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: error.message },
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/test/departments - Create department (NO AUTH)
 */
export async function POST(request: NextRequest) {
  const blocked = developmentOnly();
  if (blocked) return blocked;
  try {
    const body = await request.json();

    const department = await prisma.department.create({
      data: { name: body.name },
    });

    return NextResponse.json(
      {
        success: true,
        data: department,
        message: "Department created successfully",
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message } },
      { status: 500 },
    );
  }
}
