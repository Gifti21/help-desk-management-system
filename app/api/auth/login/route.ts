import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/session';

export async function POST(request: NextRequest) {
    try {
        console.log('[LOGIN API] Request received');

        const body = await request.json();
        console.log('[LOGIN API] Body parsed:', { email: body.email, hasPassword: !!body.password });

        const { email, password } = body;

        if (!email || !password) {
            console.log('[LOGIN API] Missing credentials');
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            );
        }

        console.log('[LOGIN API] Calling loginUser for email:', email);
        const user = await loginUser(email, password);
        console.log('[LOGIN API] loginUser result:', user ? { id: user.id, email: user.email, role: user.role } : null);

        if (!user) {
            console.log('[LOGIN API] Login failed - invalid credentials or inactive user');
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        console.log('[LOGIN API] Login successful for:', user.email, 'Role:', user.role);
        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('[LOGIN API] Error:', error);
        return NextResponse.json(
            { success: false, error: 'An error occurred during login', details: String(error) },
            { status: 500 }
        );
    }
}
