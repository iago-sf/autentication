const nodemailer = require("nodemailer");

let mailConfig = {
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "a40c307adee568",
    pass: "d976fd6b5a830d"
  }
};

module.exports = nodemailer.createTransport(mailConfig);
