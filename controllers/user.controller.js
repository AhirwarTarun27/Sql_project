const UserModel = require("../models/user.model");

const createUser = async (data) => {
  return UserModel.create({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    phoneNumber: data.phoneNumber,
  });
};

const getUser = async () => {
  return UserModel.findAll();
};

module.exports = {
  createUser,
  getUser,
};
