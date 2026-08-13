const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'prayash',
  database: 'Dine'
}).promise();

module.exports = db;
