const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgresAR',
    port: 5432,
});
module.exports = {
  query: async (text, params) => pool.query(text, params),
};