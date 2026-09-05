import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";

/**
 * POST /api/test/login-employee - Auto-login as employee for testing (creates employee if needed)
 */
export async function POST(request: NextRequest) {
  try {
    console.log("=== AUTO LOGIN EMPLOYEE TEST ===");

    // Find or create an employee user
    let employee = await prisma.user.findFirst({
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

    // If no employee exists, create one
    if (!employee) {
      console.log("No employee found, creating one...");

      // Get a department to assign the employee to
      const department = await prisma.department.findFirst();
      if (!department) {
        return NextResponse.json(
          {
            success: false,
            error:
              "No departments found. Please create a department first through admin panel.",
            createDepartmentHint:
              "Go to /admin/departments to create departments first",
          },
          { status: 400 },
        );
      }

      // Hash password
      const hashedPassword = await bcrypt.hash("employee123", 10);

      // Create employee user
      employee = await prisma.user.create({
        data: {
          email: "employee@helpdesk.com",
          password: hashedPassword,
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

      console.log("✅ Employee created:", {
        id: employee.id,
        email: employee.email,
        name: `${employee.firstName} ${employee.lastName}`,
        department: employee.department?.name,
      });
    } else {
      console.log("Found existing employee:", {
        id: employee.id,
        email: employee.email,
        name: `${employee.firstName} ${employee.lastName}`,
        department: employee.department?.name || "No department",
      });
    }

    // Login the employee
    const response = NextResponse.json({
      success: true,
      message: "Logged in as employee successfully",
      credentials: {
        email: employee.email,
        password:
          employee.email === "employee@helpdesk.com"
            ? "employee123"
            : "Check database",
      },
      user: {
        id: employee.id,
        email: employee.email,
        name: `${employee.firstName} ${employee.lastName}`,
        role: employee.role,
        department: employee.department?.name || "No department",
      },
    });

    // Set session cookie
    await createSession({
      id: employee.id,
      email: employee.email,
      firstName: employee.firstName,
      lastName: employee.lastName,
      role: employee.role,
      departmentId: employee.departmentId,
    });

    console.log("✅ Employee logged in successfully");
    return response;
  } catch (error: any) {
    console.error("❌ Auto login employee failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to login as employee",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
