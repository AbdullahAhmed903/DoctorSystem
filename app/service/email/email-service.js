// email.service.js
import { SEND_EMAIL_BY_NODEMAILER } from "./email-sender.js";
import { cancelAppointmentTemplate } from "./templates/cancel-template.js";
import { codeTemplate } from "./templates/code-template.js";
import { paymentSuccessTemplate } from "./templates/payment-template.js";
import { verifyEmailTemplate } from "./templates/verify-email-template.js";

export const EMAIL_TYPES = {
  VERIFY_EMAIL: "VERIFY_EMAIL",
  CODE: "CODE",
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  CANCEL_APPOITMENT :"CANCEL_APPOINTMENT_PATIENT"
};

const templates = {
  [EMAIL_TYPES.VERIFY_EMAIL]: verifyEmailTemplate,
  [EMAIL_TYPES.CODE]: codeTemplate,
  [EMAIL_TYPES.PAYMENT_SUCCESS]: paymentSuccessTemplate,
  [EMAIL_TYPES.CANCEL_APPOITMENT]:cancelAppointmentTemplate
};


export const sendEmail = async ({ email, type, payload }) => {  
    let subject="Welcome to Doctor System";
  const template = templates[type];  
  if (!template) throw new Error("Invalid email type");    
  const html = template(payload);

  return SEND_EMAIL_BY_NODEMAILER(email, subject, html);
};
