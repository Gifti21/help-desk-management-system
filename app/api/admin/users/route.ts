import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

// Validation schema for user creation
const userCreateSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "agent", "employee"], {
    message: "Role must be admin, agent, or employee",
  }),
  departmentId: z.string().min(1, "Department is required"),
  isActive: z.boolean().optional().default(true),
});

/**
 * GET /api/admin/users - Get all users (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const departmentId = searchParams.get("departmentId");
    const isActive = searchParams.get("isActive");

    // Build where clause
    const where: any = {};
    if (role) where.role = role;
    if (departmentId) where.departmentId = departmentId;
    if (isActive !== null) where.isActive = isActive === "true";

    const users = await prisma.user.findMany({
      where,
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            requestedTickets: true,
            assignedTickets: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Remove password hash from response
    const usersWithoutPassword = users.map(
      ({ passwordHash, ...userRest }) => userRest,
    );

    return NextResponse.json({
      success: true,
      data: usersWithoutPassword,
    });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/users - Create a new user (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();

    if (!sessionUser || sessionUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = userCreateSchema.safeParse(body);
    if (!validation.success) {
      console.error(
        "[CREATE USER] Validation failed:",
        validation.error.issues,
      );
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.issues,
          message: validation.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .join(", "),
        },
        { status: 400 },
      );
    }

    const {
      email,
      firstName,
      lastName,
      password,
      role,
      departmentId,
      isActive,
    } = validation.data;

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return NextResponse.json(
        { error: "Department not found" },
        { status: 404 },
      );
    }

    // Check for duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        firstName,
        lastName,
        passwordHash,
        role: role.toUpperCase() as "ADMIN" | "AGENT" | "EMPLOYEE",
        departmentId,
        isActive,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        success: true,
        data: userWithoutPassword,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
