const express = require("express");
const UserModel = require("../models/user.model");

const userRouter = express.Router();

const {
  createUser,
  getUser,
  updateVerifiedStatus,
  findUser,
} = require("../controllers/user.controller");
const sendEmail = require("../configs/email");
const { token, verifyToken } = require("../configs/token");

userRouter.route("/addUserData").post(async (req, res) => {
  try {
    const user = await createUser(req.body);
    console.log(req.body.email);
    var newToken = token(user);
    sendEmail(req.body.email, newToken);
    res.status(201).send({ user, newToken });
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

userRouter.route("/user_verification/:token").get(async (req, res) => {
  try {
    const userToken = req.params.token;
    if (userToken) {
      const auth = await verifyToken(userToken);
      console.log(auth);
      const userId = await findUser(auth.user.id);

      //updating status of user
      const updatedUser = await updateVerifiedStatus(userId.id);

      return res.send({
        newUser: updatedUser,
        message: "User verification completed",
      });
    } else {
      return res.send({
        message: "Invalid Link",
      });
    }
  } catch (error) {
    throw error;
  }
});

module.exports = userRouter;
