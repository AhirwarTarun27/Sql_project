require("dotenv").config();
const jwt = require("jsonwebtoken");

const token = (user) => {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "60m",
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
      if (err) return reject(err);

      resolve(decode);
    });
  });
};

module.exports = { token, verifyToken };
