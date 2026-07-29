import { NextResponse } from 'next/server';
import { checkDatabaseHealth } from '@/lib/db-test';

export async function GET() {
    try {
        const health = await checkDatabaseHealth();

        return NextResponse.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            database: health
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error',
            database: { status: 'unhealthy' }
        }, { status: 500 });
    }
}