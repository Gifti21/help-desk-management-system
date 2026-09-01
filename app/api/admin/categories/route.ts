import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const categorySchema = z.object({
    name: z.string().min(1, 'Category name is required').max(100),
});

/**
 * GET /api/admin/categories - Get all categories (Admin only)
 */
export async function GET() {
    try {
        const user = await getSessionUser();

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        tickets: true,
                    }
                }
            },
            orderBy: {
                name: 'asc',
            }
        });

        return NextResponse.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error('GET /api/admin/categories error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/categories - Create a new category (Admin only)
 */
export async function POST(request: NextRequest) {
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
        const validation = categorySchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.errors },
                { status: 400 }
            );
        }

        const { name } = validation.data;

        // Check for duplicate category name
        const existingCategory = await prisma.category.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: 'insensitive'
                }
            }
        });

        if (existingCategory) {
            return NextResponse.json(
                { error: 'Category with this name already exists' },
                { status: 409 }
            );
        }

        // Create category
        const category = await prisma.category.create({
            data: {
                name,
            }
        });

        return NextResponse.json({
            success: true,
            data: category,
        }, { status: 201 });

    } catch (error) {
        console.error('POST /api/admin/categories error:', error);
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        );
    }
}
