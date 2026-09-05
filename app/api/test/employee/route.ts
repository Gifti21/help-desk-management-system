import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/test/employee - Test employee API functionality
 * This endpoint tests:
 * 1. Database connection
 * 2. Employee data retrieval
 * 3. Ticket queries for employees
 */
export async function GET(request: NextRequest) {
    try {
        console.log('=== EMPLOYEE API TEST START ===');

        // 1. Test database connection
        console.log('1. Testing database connection...');
        await prisma.$queryRaw`SELECT 1`;
        console.log('✅ Database connection successful');

        // 2. Find an employee user
        console.log('\n2. Finding employee user...');
        const employee = await prisma.user.findFirst({
            where: { role: 'EMPLOYEE' },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                departmentId: true,
                department: {
                    select: { name: true }
                }
            }
        });

        if (!employee) {
            console.log('❌ No employee found in database');
            return NextResponse.json({
                success: false,
                error: 'No employee found in database',
                message: 'Please create an employee user first using the admin panel'
            });
        }

        console.log('✅ Employee found:', {
            id: employee.id,
            email: employee.email,
            name: `${employee.firstName} ${employee.lastName}`,
            department: employee.department?.name
        });

        // 3. Get employee's tickets
        console.log('\n3. Fetching employee tickets...');
        const tickets = await prisma.ticket.findMany({
            where: { requesterId: employee.id },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                category: { select: { name: true } },
                department: { select: { name: true } },
                assignee: {
                    select: { firstName: true, lastName: true }
                },
                _count: {
                    select: { comments: true }
                }
            }
        });

        console.log(`✅ Found ${tickets.length} tickets for employee`);

        // 4. Get ticket statistics
        console.log('\n4. Calculating statistics...');
        const stats = await Promise.all([
            prisma.ticket.count({ where: { requesterId: employee.id } }),
            prisma.ticket.count({ where: { requesterId: employee.id, status: 'OPEN' } }),
            prisma.ticket.count({ where: { requesterId: employee.id, status: 'IN_PROGRESS' } }),
            prisma.ticket.count({
                where: {
                    requesterId: employee.id,
                    status: { in: ['RESOLVED', 'CLOSED'] }
                }
            })
        ]);

        const [total, open, inProgress, closed] = stats;

        console.log('✅ Statistics calculated:', {
            total,
            open,
            inProgress,
            closed
        });

        // 5. Get categories and departments for creating tickets
        console.log('\n5. Fetching categories and departments...');
        const [categories, departments] = await Promise.all([
            prisma.category.findMany({ select: { id: true, name: true } }),
            prisma.department.findMany({ select: { id: true, name: true } })
        ]);

        console.log(`✅ Found ${categories.length} categories and ${departments.length} departments`);

        console.log('\n=== EMPLOYEE API TEST COMPLETE ===\n');

        return NextResponse.json({
            success: true,
            message: 'Employee API test successful',
            data: {
                employee: {
                    id: employee.id,
                    email: employee.email,
                    name: `${employee.firstName} ${employee.lastName}`,
                    department: employee.department?.name || 'N/A'
                },
                stats: {
                    total,
                    open,
                    inProgress,
                    closed
                },
                recentTickets: tickets.map(t => ({
                    id: t.id,
                    title: t.title,
                    status: t.status,
                    priority: t.priority,
                    category: t.category.name,
                    department: t.department.name,
                    assignee: t.assignee ? `${t.assignee.firstName} ${t.assignee.lastName}` : 'Unassigned',
                    comments: t._count.comments,
                    createdAt: t.createdAt
                })),
                availableCategories: categories,
                availableDepartments: departments
            },
            testResults: {
                databaseConnection: '✅ Connected',
                employeeFound: '✅ Yes',
                ticketsFound: `✅ ${tickets.length} tickets`,
                statisticsCalculated: '✅ Yes',
                categoriesLoaded: `✅ ${categories.length} categories`,
                departmentsLoaded: `✅ ${departments.length} departments`
            }
        });
    } catch (error: any) {
        console.error('❌ EMPLOYEE API TEST FAILED:', error);
        return NextResponse.json({
            success: false,
            error: 'Employee API test failed',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
