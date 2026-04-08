const { Pool } = require('pg');

const poolOptions = process.env.DATABASE_URL 
  ? { 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Required for most hosted DBs like Supabase/Render
    }
  : {
      user: 'postgres',
      host: 'localhost',
      database: 'pocketlog_db',
      password: process.env.DB_PASSWORD,
      port: 5432,
    };

const pool = new Pool(poolOptions);

module.exports = pool;
