
const { sql } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.local' });

async function checkSchema() {
    try {
        console.log('Checking push_subscriptions table...');
        const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'push_subscriptions'
      );
    `;
        console.log('Table exists:', tableCheck.rows[0].exists);

        console.log('Checking workouts column...');
        const columnCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'workouts' 
        AND column_name = 'notification_sent'
      );
    `;
        console.log('Column exists:', columnCheck.rows[0].exists);
    } catch (err) {
        console.error('Error checking schema:', err);
    }
}

checkSchema();
