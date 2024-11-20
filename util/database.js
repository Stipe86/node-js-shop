const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-js-shop", "root", "StipSQL", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
