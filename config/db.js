// config/db.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config({ path: './e_commerce_server/.env' }); // Specify the path to the .env file

// Configure database connection settings
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    options: '-c search_path=public', // Force use of public schema
});

// Check if the connection is successful
pool.connect((err) => {
    if (err) {
        console.error('Error connecting to PostgreSQL database:', err);
    } else {
        console.log('Connected to PostgreSQL database');
    }
});

// Export the query method for executing queries
module.exports = {
    query: (text, params) => pool.query(text, params)
};
