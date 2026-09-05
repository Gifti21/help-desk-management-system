import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

/**
 * PATCH /api/employee/profile/password - Change password (Employee only)
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
        const passwordSchema = z.object({
            currentPassword: z.string().min(1, 'Current password is required'),
            newPassword: z.string().min(6, 'New password must be at least 6 characters'),
            confirmPassword: z.string().min(1, 'Please confirm new password'),
        }).refine((data) => data.newPassword === data.confirmPassword, {
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        });

        const validation = passwordSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: validation.error.errors
                },
                { status: 400 }
            );
        }

        const { currentPassword, newPassword } = validation.data;

        // Get current user with password
        const currentUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                password: true
            }
        });

        if (!currentUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('PATCH /api/employee/profile/password error:', error);
        return NextResponse.json(
            { error: 'Failed to change password' },
            { status: 500 }
        );
    }
}