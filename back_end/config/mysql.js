const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'Sd221456!',
    database: process.env.MYSQL_DATABASE || 'laptop_shopping',
    waitForConnections: false,
    connectionLimit: 10,
    queueLimit: 0,
});

// Export the promise-based connection pool
module.exports = pool.promise();