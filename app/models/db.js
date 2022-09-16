const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

const pool = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

pool.query('select 1 + 1', (err, rows) => { /* */ });

module.exports = pool;