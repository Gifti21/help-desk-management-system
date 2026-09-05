import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * GET /api/employee/tickets - Get employee's tickets (Employee only)
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

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        // Build where clause
        const where: any = { requesterId: user.id };
        if (status && status !== 'all') {
            where.status = status.toUpperCase();
        }

        // Fetch employee's tickets
        const tickets = await prisma.ticket.findMany({
            where,
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
        });

        return NextResponse.json({
            success: true,
            data: tickets
        });
    } catch (error) {
        console.error('GET /api/employee/tickets error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tickets' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/employee/tickets - Create new ticket (Employee only)
 */
export async function POST(request: NextRequest) {
    try {
        const user = await getSessionUser();

        if (!user || user.role !== 'EMPLOYEE') {
            return NextResponse.json(
                { error: 'Unauthorized - Employee access required' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Validation schema
        const createSchema = z.object({
            title: z.string().min(1, 'Title is required'),
            description: z.string().min(1, 'Description is required'),
            priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
            categoryId: z.string().min(1, 'Category is required'),
        });

        const validation = createSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validation.error.errors
                },
                { status: 400 }
            );
        }

        const { title, description, priority, categoryId } = validation.data;

        // Verify category exists
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 400 }
            );
        }

        // Use employee's department automatically
        if (!user.departmentId) {
            return NextResponse.json(
                { error: 'Employee must be assigned to a department' },
                { status: 400 }
            );
        }

        // Create ticket using employee's department
        const ticket = await prisma.ticket.create({
            data: {
                title,
                description,
                priority,
                status: 'OPEN',
                categoryId,
                departmentId: user.departmentId,
                requesterId: user.id,
            },
            include: {
                category: { select: { id: true, name: true } },
                department: { select: { id: true, name: true } },
                requester: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: ticket,
            message: 'Ticket created successfully'
        }, { status: 201 });
    } catch (error) {
        console.error('POST /api/employee/tickets error:', error);
        return NextResponse.json(
            { error: 'Failed to create ticket' },
            { status: 500 }
        );
    }
}
