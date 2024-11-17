const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-js-shop",
  password: "StipSQL",
});

module.exports = pool.promise();
