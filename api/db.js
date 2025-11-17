const { Pool } = require('pg');

// Cache the pool instance to be reused across invocations.
let pool;

const getPool = () => {
  if (!pool) {
    console.log('Creating new PostgreSQL connection pool.');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
  }
  return pool;
};

module.exports = {
  // The query function will now use the singleton pool
  query: (text, params) => getPool().query(text, params),
  // Export getPool for handling transactions correctly
  getPool
};