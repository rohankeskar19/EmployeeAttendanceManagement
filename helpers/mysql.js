const mysql = require("mysql");
const config = require("../config/keys");

const pool = mysql.createPool({
  connectionLimit: 100,
  host: config.databaseHost,
  user: config.databaseUser,
  password: config.databasePassword,
  database: config.database,
  debug: false
});

module.exports = pool;
