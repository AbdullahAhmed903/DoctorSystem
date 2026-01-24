import twilio from "twilio"; 
import CONFIG from '../../config/config.js';
import { asyncHandler } from "../middlewares/error-handling.js";





const client = twilio(CONFIG.TWILIO_ACCOUNT_SID, CONFIG.TWILIO_AUTH_TOKEN);



export const sendOTP = async (phoneNumber,otp) => {
  const message = await client.messages.create({
    from: 'whatsapp:+14155238886', // sandbox number
    to: 'whatsapp:+201090524452',   // must be joined to sandbox
    body: `Your OTP code is: ${otp}`
  });

  console.log(message.sid);
};


