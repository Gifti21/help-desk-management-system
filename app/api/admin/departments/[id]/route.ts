import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateDepartmentSchema = z.object({
    name: z.string()
        .min(1, 'Department name is required')
        .max(100, 'Department name must be less than 100 characters')
        .trim(),
});

/**
 * GET /api/admin/departments/[id] - Get single department (Admin only)
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const department = await prisma.department.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: {
                        users: true,
                        tickets: true,
                    },
                },
            },
        });

        if (!department) {
            return NextResponse.json(
                { success: false, error: { code: 'NOT_FOUND', message: 'Department not found' } },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: department,
        });
    } catch (error: any) {
        console.error('Error fetching department:', error);
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch department' } },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/admin/departments/[id] - Update department (Admin only)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        const validation = updateDepartmentSchema.safeParse(body);

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

        // Check if department exists
        const existing = await prisma.department.findUnique({
            where: { id: params.id },
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, error: { code: 'NOT_FOUND', message: 'Department not found' } },
                { status: 404 }
            );
        }

        // Check for duplicate name (excluding current department)
        const duplicate = await prisma.department.findFirst({
            where: {
                name: validation.data.name,
                id: { not: params.id },
            },
        });

        if (duplicate) {
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

        const department = await prisma.department.update({
            where: { id: params.id },
            data: validation.data,
        });

        return NextResponse.json({
            success: true,
            data: department,
            message: 'Department updated successfully',
        });
    } catch (error: any) {
        console.error('Error updating department:', error);
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update department' } },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/departments/[id] - Delete department (Admin only)
 * Prevents deletion if department has users or tickets
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        // Check if department exists and has any users or tickets
        const department = await prisma.department.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: {
                        users: true,
                        tickets: true,
                    },
                },
            },
        });

        if (!department) {
            return NextResponse.json(
                { success: false, error: { code: 'NOT_FOUND', message: 'Department not found' } },
                { status: 404 }
            );
        }

        if (department._count.users > 0 || department._count.tickets > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'CONSTRAINT_ERROR',
                        message: 'Cannot delete department with existing users or tickets',
                        details: {
                            users: department._count.users,
                            tickets: department._count.tickets,
                        },
                    },
                },
                { status: 400 }
            );
        }

        await prisma.department.delete({
            where: { id: params.id },
        });

        return NextResponse.json({
            success: true,
            message: 'Department deleted successfully',
        });
    } catch (error: any) {
        console.error('Error deleting department:', error);
        return NextResponse.json(
            { success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to delete department' } },
            { status: 500 }
        );
    }
}
