import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { developmentOnly } from "@/lib/development-only";

/**
 * POST /api/test/create-employee - Create a test employee user
 */
export async function POST(request: NextRequest) {
  const blocked = developmentOnly();
  if (blocked) return blocked;
  try {
    console.log("=== CREATING TEST EMPLOYEE ===");

    // Check if employee already exists
    const existingEmployee = await prisma.user.findFirst({
      where: {
        email: "employee@helpdesk.com",
      },
    });

    if (existingEmployee) {
      console.log("Employee already exists:", existingEmployee.email);
      return NextResponse.json({
        success: true,
        message: "Employee user already exists",
        user: {
          id: existingEmployee.id,
          email: existingEmployee.email,
          name: `${existingEmployee.firstName} ${existingEmployee.lastName}`,
          role: existingEmployee.role,
          departmentId: existingEmployee.departmentId,
        },
      });
    }

    // Get a department to assign the employee to
    const department = await prisma.department.findFirst();
    if (!department) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No departments found. Please create a department first through admin panel.",
        },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("employee123", 10);

    // Create employee user
    const employee = await prisma.user.create({
      data: {
        email: "employee@helpdesk.com",
        passwordHash: hashedPassword,
        firstName: "John",
        lastName: "Employee",
        role: "EMPLOYEE",
        departmentId: department.id,
      },
      include: {
        department: {
          select: { name: true },
        },
      },
    });

    console.log("✅ Employee created:", {
      id: employee.id,
      email: employee.email,
      name: `${employee.firstName} ${employee.lastName}`,
      department: employee.department.name,
    });

    return NextResponse.json({
      success: true,
      message: "Employee user created successfully",
      user: {
        id: employee.id,
        email: employee.email,
        name: `${employee.firstName} ${employee.lastName}`,
        role: employee.role,
        department: employee.department.name,
      },
    });
  } catch (error: any) {
    console.error("❌ Create employee failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create employee",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/test/create-employee - Check existing employee users
 */
export async function GET(request: NextRequest) {
  const blocked = developmentOnly();
  if (blocked) return blocked;
  try {
    console.log("=== CHECKING EMPLOYEE USERS ===");

    const employees = await prisma.user.findMany({
      where: { role: "EMPLOYEE" },
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

    console.log(`Found ${employees.length} employee users:`, employees);

    return NextResponse.json({
      success: true,
      message: `Found ${employees.length} employee users`,
      data: {
        employees: employees.map((emp) => ({
          id: emp.id,
          email: emp.email,
          name: `${emp.firstName} ${emp.lastName}`,
          department: emp.department?.name || "No department",
        })),
        count: employees.length,
      },
    });
  } catch (error: any) {
    console.error("❌ Check employees failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check employee users",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
