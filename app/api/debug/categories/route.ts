import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/debug/categories - Debug endpoint to test category fetching
 */
export async function GET() {
    try {
        // Direct Prisma query without any middleware
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        tickets: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        return NextResponse.json({
            success: true,
            count: categories.length,
            data: categories,
            message: `Found ${categories.length} categories in the database`,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack,
        }, { status: 500 });
    }
}
