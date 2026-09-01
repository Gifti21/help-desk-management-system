import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/settings - Get system information (Admin only)
 */
export async function GET(request: NextRequest) {
    try {
        const user = await getSessionUser();

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        // Get system statistics
        const [
            totalUsers,
            activeUsers,
            totalTickets,
            dbStatus
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { isActive: true } }),
            prisma.ticket.count(),
            // Test database connection
            prisma.$queryRaw`SELECT 1`.then(() => 'Connected').catch(() => 'Disconnected')
        ]);

        return NextResponse.json({
            success: true,
            data: {
                systemInfo: {
                    version: 'v2.1.0',
                    dbStatus,
                    totalUsers,
                    activeUsers,
                    totalTickets,
                    environment: process.env.NODE_ENV || 'development'
                },
                currentAdmin: {
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                }
            }
        });
    } catch (error) {
        console.error('GET /api/admin/settings error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/admin/settings - Update admin profile settings (Admin only)
 */
export async function PATCH(request: NextRequest) {
    try {
        const user = await getSessionUser();

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { firstName, lastName, email } = body;

        // Update admin user profile
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(email && { email })
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true
            }
        });

        return NextResponse.json({
            success: true,
            data: updatedUser,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('PATCH /api/admin/settings error:', error);
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
}
