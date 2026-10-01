const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'expense_tracker',
    password: 'abdallah@1234567',
    port: 5432,
});

module.exports = pool;