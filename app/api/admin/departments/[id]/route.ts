import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const departmentUpdateSchema = z.object({
    name: z.string().min(1).max(100).optional(),
});

/**
 * GET /api/admin/departments/[id] - Get single department (Admin only)
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getSessionUser();

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const { id } = await params;

        const department = await prisma.department.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        users: true,
                        tickets: true,
                    }
                }
            }
        });

        if (!department) {
            return NextResponse.json(
                { error: 'Department not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: department,
        });

    } catch (error) {
        console.error('GET /api/admin/departments/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch department' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/admin/departments/[id] - Update department (Admin only)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getSessionUser();

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const validation = departmentUpdateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.errors },
                { status: 400 }
            );
        }

        const { id } = await params;

        const { id } = await params;

        const existingDepartment = await prisma.department.findUnique({
            where: { id }
        });

        if (!existingDepartment) {
            return NextResponse.json(
                { error: 'Department not found' },
                { status: 404 }
            );
        }

        const { name } = validation.data;

        if (name) {
            const duplicate = await prisma.department.findFirst({
                where: {
                    name: {
                        equals: name,
                        mode: 'insensitive'
                    },
                    id: {
                        not: id
                    }
                }
            });

            if (duplicate) {
                return NextResponse.json(
                    { error: 'Department with this name already exists' },
                    { status: 409 }
                );
            }
        }

        const department = await prisma.department.update({
            where: { id },
            data: {
                ...(name && { name }),
            }
        });

        return NextResponse.json({
            success: true,
            data: department,
        });

    } catch (error) {
        console.error('PATCH /api/admin/departments/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to update department' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/departments/[id] - Delete department (Admin only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getSessionUser();

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const { id } = await params;

        const department = await prisma.department.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        users: true,
                        tickets: true,
                    }
                }
            }
        });

        if (!department) {
            return NextResponse.json(
                { error: 'Department not found' },
                { status: 404 }
            );
        }

        if (department._count.users > 0 || department._count.tickets > 0) {
            return NextResponse.json(
                {
                    error: 'Cannot delete department with existing users or tickets',
                    userCount: department._count.users,
                    ticketCount: department._count.tickets
                },
                { status: 409 }
            );
        }

        await prisma.department.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Department deleted successfully',
        });

    } catch (error) {
        console.error('DELETE /api/admin/departments/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to delete department' },
            { status: 500 }
        );
    }
}
