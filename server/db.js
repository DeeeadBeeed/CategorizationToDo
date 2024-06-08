require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres', // Username
    password: 'Iwillneverforgetu6', // Empty password
    host: process.env.HOST, // Hostname
    port: process.env.DBPORT, // Database port
    database: 'todoapp' // Database name
});

module.exports = pool;
