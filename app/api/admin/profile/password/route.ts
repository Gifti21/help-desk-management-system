import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { z } from 'zod';

/**
 * POST /api/admin/profile/password - Change password (Admin only)
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

        // Validation schema
        const passwordSchema = z.object({
            currentPassword: z.string().min(1, 'Current password is required'),
            newPassword: z.string().min(6, 'Password must be at least 6 characters'),
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

        // Fetch user with password hash
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { passwordHash: true }
        });

        if (!dbUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, dbUser.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 400 }
            );
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: newPasswordHash }
        });

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('POST /api/admin/profile/password error:', error);
        return NextResponse.json(
            { error: 'Failed to change password' },
            { status: 500 }
        );
    }
}
