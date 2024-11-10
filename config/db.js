// config/db.js
const { Pool } = require('pg');

// Configure database connection settings
const pool = new Pool({
    user: 'mariusiulianmoraru',         // PostgreSQL username
    host: 'localhost',             // PostgreSQL server host (usually localhost)
    database: 'E-CommerceAPI',     // Database name
    password: 'Annamaria16@',     // PostgreSQL user password
    port: 5432                     // PostgreSQL port (default is 5432)
});

// Check if the connection is successful
pool.connect((err) => {
    if (err) {
        console.error('Error connecting to PostgreSQL database:', err);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});

module.exports = pool;
