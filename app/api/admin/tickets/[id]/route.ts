import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for ticket update
const ticketUpdateSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(1).optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
    categoryId: z.string().uuid().optional(),
    departmentId: z.string().uuid().optional(),
    assigneeId: z.string().uuid().nullable().optional(),
});

/**
 * GET /api/admin/tickets/[id] - Get single ticket (Admin only)
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const ticket = await prisma.ticket.findUnique({
            where: { id: params.id },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                requester: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    }
                },
                assignee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                role: true,
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'asc',
                    }
                }
            }
        });

        if (!ticket) {
            return NextResponse.json(
                { error: 'Ticket not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: ticket,
        });

    } catch (error) {
        console.error('GET /api/admin/tickets/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch ticket' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/admin/tickets/[id] - Update ticket (Admin only)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Validate request body
        const validation = ticketUpdateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.errors },
                { status: 400 }
            );
        }

        // Check if ticket exists
        const existingTicket = await prisma.ticket.findUnique({
            where: { id: params.id }
        });

        if (!existingTicket) {
            return NextResponse.json(
                { error: 'Ticket not found' },
                { status: 404 }
            );
        }

        const { title, description, status, priority, categoryId, departmentId, assigneeId } = validation.data;

        // Verify category exists (if being updated)
        if (categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: categoryId }
            });
            if (!category) {
                return NextResponse.json(
                    { error: 'Category not found' },
                    { status: 404 }
                );
            }
        }

        // Verify department exists (if being updated)
        if (departmentId) {
            const department = await prisma.department.findUnique({
                where: { id: departmentId }
            });
            if (!department) {
                return NextResponse.json(
                    { error: 'Department not found' },
                    { status: 404 }
                );
            }
        }

        // Verify assignee exists and has correct role (if being updated)
        if (assigneeId !== undefined && assigneeId !== null) {
            const assignee = await prisma.user.findUnique({
                where: { id: assigneeId }
            });
            if (!assignee) {
                return NextResponse.json(
                    { error: 'Assignee not found' },
                    { status: 404 }
                );
            }
            if (assignee.role !== 'agent' && assignee.role !== 'admin') {
                return NextResponse.json(
                    { error: 'Assignee must be an agent or admin' },
                    { status: 400 }
                );
            }
        }

        // Prepare update data
        const updateData: any = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (status) updateData.status = status;
        if (priority) updateData.priority = priority;
        if (categoryId) updateData.categoryId = categoryId;
        if (departmentId) updateData.departmentId = departmentId;
        if (assigneeId !== undefined) updateData.assigneeId = assigneeId;

        // Update ticket
        const ticket = await prisma.ticket.update({
            where: { id: params.id },
            data: updateData,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                department: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                requester: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                },
                assignee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: ticket,
        });

    } catch (error) {
        console.error('PATCH /api/admin/tickets/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to update ticket' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/tickets/[id] - Delete ticket (Admin only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        // Check if ticket exists
        const ticket = await prisma.ticket.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: {
                        comments: true,
                    }
                }
            }
        });

        if (!ticket) {
            return NextResponse.json(
                { error: 'Ticket not found' },
                { status: 404 }
            );
        }

        // Delete associated comments first (cascade delete)
        if (ticket._count.comments > 0) {
            await prisma.comment.deleteMany({
                where: { ticketId: params.id }
            });
        }

        // Delete ticket
        await prisma.ticket.delete({
            where: { id: params.id }
        });

        return NextResponse.json({
            success: true,
            message: 'Ticket deleted successfully',
        });

    } catch (error) {
        console.error('DELETE /api/admin/tickets/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to delete ticket' },
            { status: 500 }
        );
    }
}
