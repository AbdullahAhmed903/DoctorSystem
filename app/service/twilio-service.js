import twilio from "twilio"; 
import CONFIG from '../../config/config.js';
import { asyncHandler } from "../utils/error-handling.js";


const client = twilio(CONFIG.TWILIO_ACCOUNT_SID, CONFIG.TWILIO_AUTH_TOKEN);

// async function sendOTP(to, otp) {
//   try {
//     const message = await client.messages.create({
//       body: `Your OTP is: ${otp}`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: to
//     });
//     console.log("SMS sent:", message.sid);
//   } catch (err) {
//     console.error("Error sending SMS:", err);
//   }
// }


export const sendOTP = async () => {
  try {
    const message = await client.messages.create({
      body: `Your OTP is:${598746} `,
      from:" +13518881934", // use config
      to:" +201226362869"
    });
    console.log("SMS sent:", message.sid);
  } catch (err) {
    console.error("Error sending SMS:", err);
  }
};


