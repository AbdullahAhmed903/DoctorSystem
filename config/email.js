import nodemailer from "nodemailer";
import CONFIG from "./config.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: CONFIG.NODEMAILER_EMAIL_FROM,
    pass: CONFIG.NODEMAILER_API_KEY,
  },
});

export default transporter;
