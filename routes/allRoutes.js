const express = require("express");
const authorization = require("../middlewares/authorization");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userRouter = express.Router();
const {
  createUser,
  getUser,
  updateVerifiedStatus,
  findUser,
  findEmail,
  updateFields,
  resetPassword,
} = require("../controllers/user.controller");
const { sendEmail, sendResetPassLink } = require("../configs/email");
const { token, verifyToken } = require("../configs/token");
const bcrypt = require("bcryptjs/dist/bcrypt");

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

userRouter.route("/login").post(async (req, res) => {
  try {
    const email = req.body.email;
    const user = await findEmail(email);
    // console.log(user.dataValues.email);
    if (user) {
      if (user.dataValues.isVerified) {
        const unhashedPassword = req.body.password;
        // console.log("unhashedPassword:", unhashedPassword);
        const hashedPassword = user.dataValues.password;
        // console.log("hashedPassword:", hashedPassword);

        const actualPassword = () => {
          return bcrypt.compareSync(unhashedPassword, hashedPassword);
        };

        if (actualPassword()) {
          const newToken = token(user);
          // const refreshToken = jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
          // return res.send({ user, newToken, refreshToken}).status(200);
        } else {
          return res.send({
            message: "Incorrect password",
          });
        }
      } else {
        return res.send({ message: "User is not verified" });
      }
    }
  } catch (error) {
    throw error;
  }
});

userRouter.route("/updateData").patch(authorization, async (req, res) => {
  try {
    const id = req.user.user.id;
    const newUser = req.body;
    // console.log("id:", id);
    // console.log(req.user);

    // console.log("newUser:", newUser);

    if (id && newUser) {
      const updateUser = await updateFields(id, newUser);

      res.send(updateUser).status(200);
    } else {
      return res.send({ message: "Please provide valid data" });
    }

    console.log(id, newUser);
  } catch (error) {
    throw error;
  }
});

userRouter.route("/changePassword").post(async (req, res) => {
  try {
    const email = req.body.email;
    const oldPass = req.body.oldPassword;
    const newPass = req.body.newPassword;
    if (email && oldPass && newPass) {
      const user = await findEmail(email);
      const passwordInDb = user.dataValues.password;

      const orignalPassword = () => {
        return bcrypt.compareSync(oldPass, passwordInDb);
      };

      if (orignalPassword) {
        const newToken = token(user);
        const email = user.email;

        sendResetPassLink(email, newToken);
        return res.send({ message: "Reset link sent to the email" });
      } else {
        return res.send({ message: "old password in not correct" });
      }
    } else {
      return res.send({ message: "Invalid credentials" });
    }
  } catch (error) {
    throw error;
  }
});

userRouter.route("/resetPassword").patch(authorization, async (req, res) => {
  try {
    const userId = req.user.user.id;
    const user = await findUser(userId);
    const newPass = req.body.newPassword;

    if (user) {
      const encryptPassword = (password) => {
        if (password) {
          const hashed = bcrypt.hashSync(password, 12);
          return hashed;
        }
      };

      const updatedPass = await resetPassword(userId, encryptPassword(newPass));

      return res.send(updatedPass);
    } else {
      return res.send({ message: "link is not valid" });
    }
  } catch (error) {
    throw error;
  }
});

module.exports = userRouter;
