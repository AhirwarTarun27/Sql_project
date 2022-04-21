const Sequelize = require("sequelize");

const db = new Sequelize("student_data", "postgres", "pgsql@143", {
  host: "localhost",
  dialect: "postgres",
  //   pool: {
  //     max: 5,
  //     min: 0,
  //     acquire: 30000,
  //     idle: 10000,
  //   },
});

module.exports = db;
