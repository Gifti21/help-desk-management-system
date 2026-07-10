import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const departmentSchema = z.object({
  name: z.string().min(1)
});

// GET /api/departments - Get all departments
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const departments = await prisma.department.findMany({
      include: {
        _count: {
          select: {
            users: true,
            tickets: true
          }
        }
      },
      orderBy: { name: "asc" }
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
  }
}

// POST /api/departments - Create a new department (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = departmentSchema.parse(body);

    const department = await prisma.department.create({
      data: validatedData
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.issues }, { status: 400 });
    }
    console.error("Error creating department:", error);
    return NextResponse.json({ error: "Failed to create department" }, { status: 500 });
  }
}
