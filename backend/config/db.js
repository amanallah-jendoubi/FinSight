const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',      
  port: 5432,
  user: 'postgres',
  password: 'a123j',
  database: 'finSight_DB',
});

module.exports = pool;