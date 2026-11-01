
const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// Use the certificate from Render's environment variable,
// or fall back to the local ca.pem file during development.
const caCertificate = process.env.DB_CA_CERT
  ? process.env.DB_CA_CERT.replace(/\\n/g, "\n")
  : fs.readFileSync(path.join(__dirname, "ca.pem"), "utf8");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    ca: caCertificate,
    rejectUnauthorized: true
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
