import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { developmentOnly } from "@/lib/development-only";

/**
 * POST /api/test/setup-employee - Setup employee user for testing
 */
export async function POST(request: NextRequest) {
  const blocked = developmentOnly();
  if (blocked) return blocked;
  try {
    console.log("=== SETTING UP EMPLOYEE FOR TESTING ===");

    // First, ensure we have a department
    let department = await prisma.department.findFirst({
      where: { name: "Human Resources" },
    });

    if (!department) {
      // Create HR department if it doesn't exist
      department = await prisma.department.create({
        data: {
          name: "Human Resources",
        },
      });
      console.log("✅ Created HR department");
    }

    // Check if employee already exists
    let employee = await prisma.user.findUnique({
      where: { email: "employee@helpdesk.com" },
    });

    if (employee) {
      // Update the existing employee to ensure correct setup
      employee = await prisma.user.update({
        where: { id: employee.id },
        data: {
          role: "EMPLOYEE",
          departmentId: department.id,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          departmentId: true,
          department: {
            select: { name: true },
          },
        },
      });
      console.log("✅ Updated existing employee");
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash("employee123", 10);

      // Create new employee
      employee = await prisma.user.create({
        data: {
          email: "employee@helpdesk.com",
          passwordHash: hashedPassword,
          firstName: "John",
          lastName: "Employee",
          role: "EMPLOYEE",
          departmentId: department.id,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          departmentId: true,
          department: {
            select: { name: true },
          },
        },
      });
      console.log("✅ Created new employee");
    }

    // Test login credentials immediately
    const testUser = await prisma.user.findUnique({
      where: { email: "employee@helpdesk.com" },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        firstName: true,
        lastName: true,
        role: true,
        departmentId: true,
      },
    });

    if (testUser) {
      const passwordMatch = await bcrypt.compare(
        "employee123",
        testUser.passwordHash,
      );
      console.log("Password test result:", passwordMatch);
    }

    return NextResponse.json({
      success: true,
      message: "Employee setup complete",
      employee: {
        id: employee.id,
        email: employee.email,
        name: `${employee.firstName} ${employee.lastName}`,
        role: employee.role,
        department: employee.department?.name,
      },
      credentials: {
        email: "employee@helpdesk.com",
        password: "employee123",
      },
      instructions: [
        "1. Go to the main login page (http://localhost:3000)",
        "2. Use email: employee@helpdesk.com",
        "3. Use password: employee123",
        "4. After login, navigate to employee/tickets/new",
      ],
    });
  } catch (error: any) {
    console.error("❌ Employee setup failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to setup employee",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/test/setup-employee - Check employee status
 */
export async function GET() {
  const blocked = developmentOnly();
  if (blocked) return blocked;
  try {
    const employee = await prisma.user.findUnique({
      where: { email: "employee@helpdesk.com" },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        departmentId: true,
        department: {
          select: { name: true },
        },
      },
    });

    if (!employee) {
      return NextResponse.json({
        success: false,
        message: "Employee user not found",
        action: "POST to this endpoint to create employee",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Employee user exists",
      employee: {
        id: employee.id,
        email: employee.email,
        name: `${employee.firstName} ${employee.lastName}`,
        role: employee.role,
        department: employee.department?.name || "No department",
      },
      credentials: {
        email: "employee@helpdesk.com",
        password: "employee123",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check employee status",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
