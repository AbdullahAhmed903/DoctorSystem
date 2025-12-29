import logger from "../../../config/logger.js";
import redisClient from "../../../config/redis.js";
import Doctor from "../../DB/models/doctor-schema.js";
import EmailUpdate from "../../DB/models/emailUpdate-schema.js";
import { sendEmail } from "../../utils/emails/email-service.js";
import { constants, randomNumber, sendResponse } from "../../utils/utills-service.js";








const requestEmailUpdate = async (req, res) => {
  try {
    const { doctorId } = req.user;
    const { newEmail } = req.body;

    // 1. Validate new email
    if (!newEmail) {
      return sendResponse(res, constants.RESPONSE_BAD_REQUEST, "New email is required");
    }

    // 2. Check if new email already belongs to someone
    const existingEmailOwner = await Doctor.findOne({ email: newEmail }).lean();
    if (existingEmailOwner) {
      return sendResponse(res, constants.RESPONSE_BAD_REQUEST, "This email is already used. Choose another one.");
    }

    // 3. Get current doctor
    const doctor = await Doctor.findOne({ doctorId }).lean();
    if (!doctor) {
      return sendResponse(res, constants.RESPONSE_NOT_FOUND, "Doctor not found");
    }

    // Prevent updating to same email
    if (doctor.email === newEmail) {
      return sendResponse(res, constants.RESPONSE_BAD_REQUEST, "New email is the same as your current email");
    }

    // 4. Generate OTP codes
    const oldEmailCode = randomNumber(6);
    const newEmailCode = randomNumber(6);

    // 5. Remove old pending requests to avoid conflicts
    await EmailUpdate.deleteMany({ doctorId });

    // 6. Create new request with TTL
    await EmailUpdate.create({
      doctorId,
      newEmail,
      oldEmailCode,
      newEmailCode,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // 7. Send codes in parallel
          let codeMessage=`You recently requested to update your account email. `
            setImmediate(() => {
          // codeSender(doctor.email, oldEmailCode, doctor.name),
          sendEmail({email:doctor.email,type:"CODE",payload:{name:doctor.name,verificationCode:oldEmailCode,codeMessage}}) // Old email
          sendEmail({email:newEmail,type:"CODE",payload:{name:doctor.name,verificationCode:newEmailCode,codeMessage}})  // New email
          // codeSender(newEmail, newEmailCode, doctor.name)    
        });

    return sendResponse(res, 200, "Verification codes sent to both old and new email addresses");

  } catch (error) {
    logger.error(`Error in requestEmailUpdate: ${error.message}`);
    return sendResponse(
      res,
      constants.RESPONSE_INT_SERVER_ERROR,
      error.message,
      {},
      constants.UNHANDLED_ERROR
    );
  }
};





const emailUpdate=async(req,res)=>{
  try {
      const {doctorId}=req.user
      const {oldEmailCode,newEmailCode}=req.body
      if(!oldEmailCode||!newEmailCode){
        return sendResponse(res,constants.RESPONSE_BAD_REQUEST,"Please Enter Old and New Code")
      }
      else{
            const request = await EmailUpdate.findOne({ doctorId }).lean();

          if (!request) {
            return sendResponse(res, constants.RESPONSE_NOT_FOUND, "No email update request found");
          }
        if(String(request.oldEmailCode) === String(oldEmailCode) && String(request.newEmailCode) === String(newEmailCode)){
           await Promise.all([
              Doctor.findOneAndUpdate({ doctorId }, { email: request.newEmail }),
              EmailUpdate.deleteOne({ doctorId }),
              redisClient.del(`doctor:${doctorId}`) 
              ]);
          return sendResponse(res,constants.RESPONSE_SUCCESS,"Email Update sucess")
        }
        else{
          return sendResponse(res,constants.RESPONSE_BAD_REQUEST,"Code Is Not Correct or InValid")
        }
      }
      
  } catch (error) {
      logger.error(`Error in requestEmailUpdate: ${error.message}`);
    return sendResponse(
      res,
      constants.RESPONSE_INT_SERVER_ERROR,
      error.message,
      {},
      constants.UNHANDLED_ERROR
    );
  }
}












export{
    requestEmailUpdate,
    emailUpdate
}