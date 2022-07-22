const nodemailer = require("nodemailer");

// const { default: ModelManager } = require('sequelize/types/model-manager')

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: "zilongbootcamp@gmail.com",
    pass: "mgvojoquldijwzui",
  },
  tls: {
    rejectUnauthorized: false,
  },
});
module.exports = transporter;
