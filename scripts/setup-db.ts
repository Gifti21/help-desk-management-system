import { testDatabaseConnection } from '../lib/db-test';

async function main() {
    console.log('🔄 Testing database connection...');

    const isConnected = await testDatabaseConnection();

    if (isConnected) {
        console.log('✅ Database is ready to use!');
        console.log('🚀 You can now run: npm run dev');
    } else {
        console.log('❌ Database connection failed.');
        console.log('📝 Make sure PostgreSQL is running and the DATABASE_URL is correct:');
        console.log('   DATABASE_URL:', process.env.DATABASE_URL);
        console.log('\n🔧 To start PostgreSQL:');
        console.log('   - Windows: Start PostgreSQL service');
        console.log('   - macOS: brew services start postgresql');
        console.log('   - Linux: sudo service postgresql start');
        console.log('\n📊 To create the database:');
        console.log('   createdb helpdesk_db');
        console.log('\n🔄 To run migrations:');
        console.log('   npx prisma migrate dev');
    }
}

main().catch(console.error);