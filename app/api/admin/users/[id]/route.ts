import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcrypt';

// Validation schema for user update
const userUpdateSchema = z.object({
    email: z.string().email('Invalid email address').optional(),
    firstName: z.string().min(1, 'First name is required').max(50).optional(),
    lastName: z.string().min(1, 'Last name is required').max(50).optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    role: z.enum(['admin', 'agent', 'employee'], { message: 'Role must be admin, agent, or employee' }).optional(),
    departmentId: z.string().min(1, 'Department is required').optional(),
    isActive: z.boolean().optional(),
});

/**
 * GET /api/admin/users/[id] - Get single user (Admin only)
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const sessionUser = await getSessionUser();

        if (!sessionUser || sessionUser.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const { id } = await params;

        const foundUser = await prisma.user.findUnique({
            where: { id },
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
            }
        });

        if (!foundUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Remove password hash from response
        const { passwordHash, ...userWithoutPassword } = foundUser;

        return NextResponse.json({
            success: true,
            data: userWithoutPassword,
        });

    } catch (error) {
        console.error('GET /api/admin/users/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/admin/users/[id] - Update user (Admin only)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const sessionUser = await getSessionUser();

        if (!sessionUser || sessionUser.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Validate request body
        const validation = userUpdateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validation.error.errors },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: params.id }
        });

        if (!existingUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const { email, firstName, lastName, password, role, departmentId, isActive } = validation.data;

        // If department is being changed, verify it exists
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

        // Check for duplicate email
        if (email && email.toLowerCase() !== existingUser.email) {
            const duplicate = await prisma.user.findUnique({
                where: { email: email.toLowerCase() }
            });

            if (duplicate) {
                return NextResponse.json(
                    { error: 'User with this email already exists' },
                    { status: 409 }
                );
            }
        }

        // Prepare update data
        const updateData: any = {};
        if (email) updateData.email = email.toLowerCase();
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (role) updateData.role = role.toUpperCase() as 'ADMIN' | 'AGENT' | 'EMPLOYEE';
        if (departmentId) updateData.departmentId = departmentId;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (password) {
            updateData.passwordHash = await bcrypt.hash(password, 10);
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: updateData,
            include: {
                department: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });

        // Remove password hash from response
        const { passwordHash, ...userWithoutPassword } = updatedUser;

        return NextResponse.json({
            success: true,
            data: userWithoutPassword,
        });

    } catch (error) {
        console.error('PATCH /api/admin/users/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/users/[id] - Delete user (Admin only)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const sessionUser = await getSessionUser();

        if (!sessionUser || sessionUser.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        // Check if user exists
        const userToDelete = await prisma.user.findUnique({
            where: { id: params.id },
            include: {
                _count: {
                    select: {
                        requestedTickets: true,
                        assignedTickets: true,
                    }
                }
            }
        });

        if (!userToDelete) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Prevent deletion if user has tickets
        if (userToDelete._count.requestedTickets > 0 || userToDelete._count.assignedTickets > 0) {
            return NextResponse.json(
                {
                    error: 'Cannot delete user with existing tickets',
                    requestedTickets: userToDelete._count.requestedTickets,
                    assignedTickets: userToDelete._count.assignedTickets
                },
                { status: 409 }
            );
        }

        // Delete user
        await prisma.user.delete({
            where: { id: params.id }
        });

        return NextResponse.json({
            success: true,
            message: 'User deleted successfully',
        });

    } catch (error) {
        console.error('DELETE /api/admin/users/[id] error:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}
