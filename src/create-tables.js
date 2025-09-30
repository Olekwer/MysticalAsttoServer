const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function createTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    
    console.log('📊 Reading migration SQL...');
    const sqlPath = path.join(__dirname, '..', 'prisma', 'migrations', '20250817124647_mystical_astro', 'migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('🚀 Executing SQL migration...');
    await client.query(sql);
    
    console.log('✅ Tables created successfully!');
    
    // Check if users table exists
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users'
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ Users table confirmed!');
    } else {
      console.log('❌ Users table not found!');
    }
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    
    // Try to continue anyway
    console.log('🔄 Checking existing tables...');
    try {
      const tables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `);
      console.log('📋 Existing tables:', tables.rows.map(r => r.table_name));
    } catch (e) {
      console.error('Error checking tables:', e.message);
    }
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  createTables();
}

module.exports = createTables;
