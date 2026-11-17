const { Pool } = require('pg');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || process.env.DB_URL;

const poolConfig = connectionString
  ? {
      connectionString,
      ssl: connectionString.includes('supabase')
        ? { rejectUnauthorized: false }
        : undefined,
    }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
      database: process.env.DB_NAME,
      ssl: process.env.DB_HOST && process.env.DB_HOST.includes('supabase') ? { rejectUnauthorized: false } : undefined,
    };

const pool = new Pool(poolConfig);

module.exports = pool;
