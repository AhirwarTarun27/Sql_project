const express = require("express");
const UserModel = require("../models/user.model");

const userRouter = express.Router();

const { createUser, getUser } = require("../controllers/user.controller");
const sendEmail = require("../configs/email");
const token = require("../configs/token");

userRouter.route("/addUserData").post(async (req, res) => {
  try {
    const user = await createUser(req.body);
    console.log(req.body.email);
    sendEmail(req.body.email);
    res.status(201).send(user);
  } catch (error) {
    throw error;
  }
});

userRouter.route("/getUserData").get(async (req, res) => {
  try {
    const users = await getUser();
    res.status(200).send(users);
  } catch (error) {
    throw error;
  }
});

module.exports = userRouter;
