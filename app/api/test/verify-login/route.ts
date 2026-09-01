import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

/**
 * Test endpoint to verify login credentials
 */
export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        console.log('[TEST] Attempting to verify:', email);

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'User not found',
                email: email
            });
        }

        console.log('[TEST] User found:', user.email);
        console.log('[TEST] User role:', user.role);
        console.log('[TEST] User active:', user.isActive);

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        console.log('[TEST] Password match:', passwordMatch);

        return NextResponse.json({
            success: passwordMatch,
            message: passwordMatch ? 'Credentials valid!' : 'Password incorrect',
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error('[TEST] Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Error verifying credentials',
            error: String(error)
        }, { status: 500 });
    }
}
