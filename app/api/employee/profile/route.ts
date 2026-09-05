import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

/**
 * GET /api/employee/profile - Get employee profile (Employee only)
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

        // Fetch employee profile with department info
        const profile = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                departmentId: true,
                createdAt: true,
                department: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        if (!profile) {
            return NextResponse.json(
                { error: 'Profile not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                id: profile.id,
                email: profile.email,
                firstName: profile.firstName,
                lastName: profile.lastName,
                fullName: `${profile.firstName} ${profile.lastName}`,
                role: profile.role,
                department: profile.department?.name || 'No department',
                departmentId: profile.departmentId,
                joinedDate: profile.createdAt
            }
        });
    } catch (error) {
        console.error('GET /api/employee/profile error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/employee/profile - Update employee profile (Employee only)
 */
export async function PATCH(request: NextRequest) {
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
        const updateSchema = z.object({
            firstName: z.string().min(1, 'First name is required').optional(),
            lastName: z.string().min(1, 'Last name is required').optional(),
            email: z.string().email('Invalid email format').optional(),
        });

        const validation = updateSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validation.error.errors
                },
                { status: 400 }
            );
        }

        const updateData = validation.data;

        // Check if email is already taken by another user
        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: updateData.email }
            });

            if (existingUser && existingUser.id !== user.id) {
                return NextResponse.json(
                    { error: 'Email already in use' },
                    { status: 400 }
                );
            }
        }

        // Update profile
        const updatedProfile = await prisma.user.update({
            where: { id: user.id },
            data: updateData,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                departmentId: true,
                department: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: updatedProfile.id,
                email: updatedProfile.email,
                firstName: updatedProfile.firstName,
                lastName: updatedProfile.lastName,
                fullName: `${updatedProfile.firstName} ${updatedProfile.lastName}`,
                role: updatedProfile.role,
                department: updatedProfile.department?.name || 'No department'
            }
        });
    } catch (error) {
        console.error('PATCH /api/employee/profile error:', error);
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}