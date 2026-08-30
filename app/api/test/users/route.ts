import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/test/users - Get all users (NO AUTH - For testing only)
 */
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                _count: {
                    select: {
                        requestedTickets: true,
                        assignedTickets: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        // Remove password hash from response
        const usersWithoutPassword = users.map(({ passwordHash, ...user }) => user);

        return NextResponse.json({
            success: true,
            count: users.length,
            data: usersWithoutPassword,
        });
    } catch (error) {
        console.error('GET /api/test/users error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}
