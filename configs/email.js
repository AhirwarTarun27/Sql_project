const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../.env" });

const sendEmail = (email, token) => {
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
    // text: `http://localhost:5678/user_verification/${token}`,
    html: `<a href=http://localhost:5678/user_verification/${token}>Click here to verify the email</a>`,
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email Sent", info.response);
    }
  });
};

module.exports = sendEmail;
