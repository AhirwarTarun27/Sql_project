const Sequelize = require("sequelize");
const db = require("../configs/db");
const bcrypt = require("bcryptjs");

const StudentModel = db.define("studentData", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    isUnique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  ifVarified: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

StudentModel.beforeCreate((user) => {
  return bcrypt
    .hash(user.password, 10)
    .then((hash) => (user.password = hash))
    .catch(() => {
      throw new Error();
    });
});

module.exports = StudentModel;
