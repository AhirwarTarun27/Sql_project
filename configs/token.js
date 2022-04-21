require("dotenv").config({ path: "../.env" });
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

function token(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "60m",
  });
}

// function token(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (token == null) return res.sendStatus(401);
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) res.sendStatus(403);

//     req.user = user;
//     next();
//   });
// }

module.exports = token;
