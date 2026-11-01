
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// =====================================
// DATABASE CONFIGURATION
// =====================================

const poolConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// =====================================
// SSL CONFIGURATION
// =====================================

// Use an environment-provided SSL certificate.
if (process.env.DB_CA_CERT) {
  poolConfig.ssl = {
    ca: process.env.DB_CA_CERT.replace(/\\n/g, "\n"),
    rejectUnauthorized: true
  };
} else {
  // Check for a local CA certificate.
  const caPath = path.join(__dirname, "ca.pem");

  if (fs.existsSync(caPath)) {
    poolConfig.ssl = {
      ca: fs.readFileSync(caPath, "utf8"),
      rejectUnauthorized: true
    };
  }
}

// =====================================
// CREATE DATABASE CONNECTION POOL
// =====================================

const pool = mysql.createPool(poolConfig);

// =====================================
// EXPORT DATABASE CONNECTION
// =====================================

module.exports = pool;
