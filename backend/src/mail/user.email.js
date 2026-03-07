import nodemailer from "nodemailer";
import html from "./user.mail.template.js";
import jwt from "jsonwebtoken";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "menna3li01@gmail.com",
      pass: "faia urlv shsi eivo",
    },
  });
  let mailToken = jwt.sign({ email: options.email }, "mennaalyfahmy");

  const info = await transporter.sendMail({
    from: '"AURA" <menna3li01@gmail.com>',
    to: options.email,
    subject: "Welcome to AURA - Verify Your Account",
    html: html(mailToken), // HTML body
  });
};

export default { sendEmail };
