import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Create Departments
    console.log('Creating departments...');
    const itDept = await prisma.department.upsert({
        where: { name: 'IT Support' },
        update: {},
        create: { name: 'IT Support' },
    });

    const hrDept = await prisma.department.upsert({
        where: { name: 'Human Resources' },
        update: {},
        create: { name: 'Human Resources' },
    });

    const engDept = await prisma.department.upsert({
        where: { name: 'Engineering' },
        update: {},
        create: { name: 'Engineering' },
    });

    console.log('✅ Departments created');

    // Create Categories
    console.log('Creating categories...');
    const hardwareCat = await prisma.category.upsert({
        where: { name: 'Hardware Issue' },
        update: {},
        create: { name: 'Hardware Issue' },
    });

    const softwareCat = await prisma.category.upsert({
        where: { name: 'Software Issue' },
        update: {},
        create: { name: 'Software Issue' },
    });

    const networkCat = await prisma.category.upsert({
        where: { name: 'Network Issue' },
        update: {},
        create: { name: 'Network Issue' },
    });

    console.log('✅ Categories created');

    // Create Admin User
    console.log('Creating admin user...');
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@helpdesk.com' },
        update: {},
        create: {
            email: 'admin@helpdesk.com',
            firstName: 'Admin',
            lastName: 'User',
            passwordHash: adminPasswordHash,
            role: 'ADMIN',
            departmentId: itDept.id,
            isActive: true,
        },
    });

    console.log('✅ Admin user created (admin@helpdesk.com / admin123)');

    // Create Agent User
    console.log('Creating agent user...');
    const agentPasswordHash = await bcrypt.hash('agent123', 10);

    const agentUser = await prisma.user.upsert({
        where: { email: 'agent@helpdesk.com' },
        update: {},
        create: {
            email: 'agent@helpdesk.com',
            firstName: 'Sarah',
            lastName: 'Agent',
            passwordHash: agentPasswordHash,
            role: 'AGENT',
            departmentId: itDept.id,
            isActive: true,
        },
    });

    console.log('✅ Agent user created (agent@helpdesk.com / agent123)');

    // Create Employee User
    console.log('Creating employee user...');
    const employeePasswordHash = await bcrypt.hash('employee123', 10);

    const employeeUser = await prisma.user.upsert({
        where: { email: 'employee@helpdesk.com' },
        update: {},
        create: {
            email: 'employee@helpdesk.com',
            firstName: 'John',
            lastName: 'Employee',
            passwordHash: employeePasswordHash,
            role: 'EMPLOYEE',
            departmentId: hrDept.id,
            isActive: true,
        },
    });

    console.log('✅ Employee user created (employee@helpdesk.com / employee123)');

    console.log('\n🎉 Seed completed successfully!\n');
    console.log('Test credentials:');
    console.log('Admin:    admin@helpdesk.com / admin123');
    console.log('Agent:    agent@helpdesk.com / agent123');
    console.log('Employee: employee@helpdesk.com / employee123\n');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
