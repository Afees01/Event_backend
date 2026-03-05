const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// create a connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Admin@231527',
  database: process.env.DB_NAME || 'event',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
