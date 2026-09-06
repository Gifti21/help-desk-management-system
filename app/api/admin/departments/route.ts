import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const departmentSchema = z.object({
  name: z
    .string()
    .min(1, "Department name is required")
    .max(100, "Department name must be less than 100 characters")
    .trim(),
});

/**
 * GET /api/admin/departments - Get all departments (Admin only)
 */
export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            users: true,
            tickets: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error("GET /api/admin/departments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/departments - Create a new department (Admin only)
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

    const validation = departmentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.errors },
        { status: 400 },
      );
    }

    const { name } = validation.data;

    const existingDepartment = await prisma.department.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (existingDepartment) {
      return NextResponse.json(
        { error: "Department with this name already exists" },
        { status: 409 },
      );
    }

    const department = await prisma.department.create({
      data: {
        name,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: department,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/admin/departments error:", error);
    return NextResponse.json(
      { error: "Failed to create department" },
      { status: 500 },
    );
  }
}
