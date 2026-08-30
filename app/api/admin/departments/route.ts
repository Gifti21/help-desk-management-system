import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const departmentSchema = z.object({
    name: z.string()
        .min(1, 'Department name is required')
        .max(100, 'Department name must be less than 100 characters')
        .trim(),
});

/**
 * GET /api/admin/departments - Get all departments (Admin only)
 */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
                { status: 401 }
            );
        }

        if (session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
                { status: 403 }
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
            orderBy: { name: 'asc' },
        });

        return NextResponse.json({
            success: true,
            data: departments,
        });
    } catch (error: any) {
        console.error('Error fetching departments:', error);
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch departments' } },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/departments - Create a new department (Admin only)
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
                { status: 401 }
            );
        }

        if (session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { success: false, error: { code: 'FORBIDDEN', message: 'Admin access required' } },
                { status: 403 }
            );
        }

        const body = await request.json();
        const validation = departmentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Validation failed',
                        details: validation.error.errors,
                    },
                },
                { status: 400 }
            );
        }

        // Check for duplicate department name
        const existing = await prisma.department.findUnique({
            where: { name: validation.data.name },
        });

        if (existing) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'DUPLICATE_ERROR',
                        message: 'Department name already exists',
                    },
                },
                { status: 400 }
            );
        }

        const department = await prisma.department.create({
            data: validation.data,
        });

        return NextResponse.json(
            {
                success: true,
                data: department,
                message: 'Department created successfully',
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error creating department:', error);
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create department' } },
            { status: 500 }
        );
    }
}
