// Set up node to connect to database 
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Create connection pool
const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10
});

// Use promise
const promisePool = dbPool.promise();

// Test conenction 
promisePool.query('SELECT 1')
    .then(() => {
        console.log('Database connected successfully!');
    })
    .catch((err) => {
        console.error('Database connection failed:', err.message);
    });

module.exports = promisePool;