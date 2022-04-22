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

const findUser = async (id) => {
  return UserModel.findOne({ where: { id } });
};

const updateVerifiedStatus = async (id) => {
  return UserModel.update({ isVerified: true }, { where: { id } });
};

module.exports = {
  createUser,
  getUser,
  updateVerifiedStatus,
  findUser,
};
