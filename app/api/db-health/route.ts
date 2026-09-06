import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test basic connection
    await prisma.$connect();
    
    // Check if tables exist
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    // Check notification table specifically
    const notificationCount = await prisma.notification.count().catch(() => null);
    
    return NextResponse.json({
      success: true,
      connected: true,
      tables: tables,
      notificationTableExists: notificationCount !== null,
      notificationCount: notificationCount
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      connected: false
    }, { status: 500 });
  }
}