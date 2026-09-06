import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for update
const categoryUpdateSchema = z.object({
    name: z.string().min(1).max(100).optional(),
});

/**
 * GET /api/admin/categories/[id] - Get single category (Admin only)
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

        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        tickets: true,
                    }
                }
            }
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: category,
        });

    } catch (error) {
        console.error('GET /api/admin/categories/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch category' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/admin/categories/[id] - Update category (Admin only)
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

        // Validate request body
        const validation = categoryUpdateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.errors },
                { status: 400 }
            );
        }

        const { id } = await params;

        // Check if category exists
        const existingCategory = await prisma.category.findUnique({
            where: { id }
        });

        if (!existingCategory) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        const { name } = validation.data;

        // Check for duplicate name
        if (name) {
            const duplicate = await prisma.category.findFirst({
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
                    { error: 'Category with this name already exists' },
                    { status: 409 }
                );
            }
        }

        // Update category
        const category = await prisma.category.update({
            where: { id },
            data: {
                ...(name && { name }),
            }
        });

        return NextResponse.json({
            success: true,
            data: category,
        });

    } catch (error) {
        console.error('PATCH /api/admin/categories/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to update category' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/categories/[id] - Delete category (Admin only)
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

        // Check if category exists
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        tickets: true,
                    }
                }
            }
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        // Prevent deletion if category has tickets
        if (category._count.tickets > 0) {
            return NextResponse.json(
                {
                    error: 'Cannot delete category with existing tickets',
                    ticketCount: category._count.tickets
                },
                { status: 409 }
            );
        }

        // Delete category
        await prisma.category.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'Category deleted successfully',
        });

    } catch (error) {
        console.error('DELETE /api/admin/categories/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}
