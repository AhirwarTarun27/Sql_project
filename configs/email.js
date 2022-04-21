const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../.env" });

const sendEmail = (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ahirwartarun1234@gmail.com",
      pass: process.env.GMAIL_PASS,
    },
  });

  var message = {
    from: "ahirwartarun1234@gmail.com",
    to: email,
    subject: "Verification Link",
    text: "Click the link to verify your E-mail Id",
    html: `<h1>Link</h1>`,
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email Sent", info.rejected);
    }
  });
};

module.exports = sendEmail;
