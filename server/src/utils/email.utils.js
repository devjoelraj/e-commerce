import nodemailer from "nodemailer";
import { emailPass, emailUser } from "../config/env.config.js";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  await transporter.sendMail({
    from: `"TrendNova" <${emailUser}>`,
    to,
    subject,
    html,
  });
};
