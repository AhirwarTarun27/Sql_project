const express = require("express");
const authorization = require("../middlewares/authorization");

const userRouter = express.Router();

const {
  createUser,
  getUser,
  updateVerifiedStatus,
  findUser,
  findEmail,
  updateFields,
} = require("../controllers/user.controller");
const sendEmail = require("../configs/email");
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
        const hashedPassword = user.dataValues.password;

        const actualPassword = () => {
          return bcrypt.compareSync(unhashedPassword, hashedPassword);
        };

        if (actualPassword()) {
          const newToken = token(user);
          return res.send({ user, newToken }).status(200);
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

module.exports = userRouter;
