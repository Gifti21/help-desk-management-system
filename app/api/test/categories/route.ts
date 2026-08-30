import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/test/categories - Get all categories (NO AUTH - For testing only)
 */
export async function GET() {
    try {
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
            count: categories.length,
            data: categories,
        });
    } catch (error) {
        console.error('GET /api/test/categories error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
