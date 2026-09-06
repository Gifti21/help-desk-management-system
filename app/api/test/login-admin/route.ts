import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { developmentOnly } from "@/lib/development-only";

/**
 * POST /api/test/login-admin - Auto-login as admin for testing
 */
export async function POST(request: NextRequest) {
  const blocked = developmentOnly();
  if (blocked) return blocked;
  try {
    console.log("=== AUTO LOGIN ADMIN TEST ===");

    // Find or create an admin user
    let admin = await prisma.user.findFirst({
      where: {
        OR: [{ email: "admin@helpdesk.com" }, { role: "ADMIN" }],
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

    // If no admin exists, create one
    if (!admin || admin.role !== "ADMIN") {
      console.log("No admin found, creating one...");

      // Get a department to assign the admin to
      let department = await prisma.department.findFirst();
      if (!department) {
        // Create a default department if none exists
        department = await prisma.department.create({
          data: {
            name: "Administration",
          },
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash("admin123", 10);

      // Create admin user
      admin = await prisma.user.create({
        data: {
          email: "admin@helpdesk.com",
          passwordHash: hashedPassword,
          firstName: "Admin",
          lastName: "User",
          role: "ADMIN",
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

      console.log("✅ Admin created:", {
        id: admin.id,
        email: admin.email,
        name: `${admin.firstName} ${admin.lastName}`,
        department: admin.department?.name,
      });
    } else {
      console.log("Found existing admin:", {
        id: admin.id,
        email: admin.email,
        name: `${admin.firstName} ${admin.lastName}`,
        department: admin.department?.name || "No department",
      });
    }

    // Login the admin
    const response = NextResponse.json({
      success: true,
      message: "Logged in as admin successfully",
      user: {
        id: admin.id,
        email: admin.email,
        name: `${admin.firstName} ${admin.lastName}`,
        role: admin.role,
        department: admin.department?.name || "No department",
      },
    });

    // Set session cookie
    await createSession({
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
      departmentId: admin.departmentId,
    });

    console.log("✅ Admin logged in successfully");
    return response;
  } catch (error: any) {
    console.error("❌ Auto login admin failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to login as admin",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
