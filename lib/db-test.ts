import { prisma } from './prisma';

export async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

export async function checkDatabaseHealth() {
  try {
    // Simple query to test the connection
    const result = await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', result };
  } catch (error) {
    return { status: 'unhealthy', error: (error as Error).message };
  }
}