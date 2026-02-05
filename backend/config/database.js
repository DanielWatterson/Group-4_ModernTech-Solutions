// backend/config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration from your .env file
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',  // Empty password as per your .env
    database: process.env.DB_NAME || 'moderntech_hr',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create the connection pool
let pool;

try {
    pool = mysql.createPool(dbConfig);
    console.log('✅ Database pool created successfully');

    // Test the connection
    (async () => {
        try {
            const connection = await pool.getConnection();
            console.log('✅ Database connection successful');

            // Test a simple query
            const [rows] = await connection.query('SELECT 1 as connection_test');
            console.log('✅ Database test query result:', rows[0].connection_test);

            connection.release();
        } catch (error) {
            console.error('❌ Database connection test failed:', error.message);
        }
    })();
} catch (error) {
    console.error('❌ Failed to create database pool:', error.message);
}

// Export the database connection
module.exports = pool;
