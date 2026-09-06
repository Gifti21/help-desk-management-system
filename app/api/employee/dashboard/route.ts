import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/employee/dashboard - Get employee dashboard data (Employee only)
 */
export async function GET(request: NextRequest) {
    try {
        const user = await getSessionUser();

        if (!user || user.role !== 'EMPLOYEE') {
            return NextResponse.json(
                { error: 'Unauthorized - Employee access required' },
                { status: 401 }
            );
        }

        // Get employee's tickets and statistics
        const [
            totalTickets,
            openTickets,
            inProgressTickets,
            closedTickets,
            recentTickets
        ] = await Promise.all([
            // Total tickets created by this employee
            prisma.ticket.count({
                where: { requesterId: user.id }
            }),

            // Open tickets
            prisma.ticket.count({
                where: {
                    requesterId: user.id,
                    status: 'OPEN'
                }
            }),

            // In progress tickets
            prisma.ticket.count({
                where: {
                    requesterId: user.id,
                    status: 'IN_PROGRESS'
                }
            }),

            // Closed tickets (RESOLVED + CLOSED)
            prisma.ticket.count({
                where: {
                    requesterId: user.id,
                    status: { in: ['RESOLVED', 'CLOSED'] }
                }
            }),

            // Recent 10 tickets
            prisma.ticket.findMany({
                where: { requesterId: user.id },
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: {
                    category: { select: { id: true, name: true } },
                    department: { select: { id: true, name: true } },
                    assignee: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },
                    _count: {
                        select: { comments: true }
                    }
                }
            })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    total: totalTickets,
                    open: openTickets,
                    inProgress: inProgressTickets,
                    closed: closedTickets
                },
                recentTickets
            }
        });
    } catch (error) {
        console.error('GET /api/employee/dashboard error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    }
}
