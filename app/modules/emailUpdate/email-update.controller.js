import logger from "../../../config/logger.js";
import redisClient from "../../../config/redis.js";
import Doctor from "../../DB/models/doctor-schema.js";
import EmailUpdate from "../../DB/models/emailUpdate-schema.js";
import patientModel from "../../DB/models/patient-schema.js";
import { sendEmail } from "../../service/email/email-service.js";
import { constants, randomNumber, sendResponse } from "../../utils/utills-service.js";
import { updateUserEmail } from "./emailServices/email-update-service.js";
import { checkUserType } from "./emailServices/request-email-service.js";








const requestEmailUpdate = async (req, res) => {
  try {
    const { newEmail } = req.body;    

        // 1. Validate new email
    if (!newEmail) {
      return sendResponse(res, constants.RESPONSE_BAD_REQUEST, "New email is required");
    }

    const user = await checkUserType(req.user,newEmail)

    if(user.exist){
        return sendResponse(res, constants.RESPONSE_BAD_REQUEST, user.message);
    }

    // // 4. Generate OTP codes
    const oldEmailCode = randomNumber(6);
    const newEmailCode = randomNumber(6);

    await EmailUpdate.deleteMany({ userId:user.userId });

    await EmailUpdate.create({
      userId:user.userId,
      newEmail,
      oldEmailCode,
      newEmailCode,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

          let codeMessage=`You recently requested to update your email account. `
          setImmediate(() => {
          sendEmail({email:user.email,type:"CODE",payload:{name:user.name,verificationCode:oldEmailCode,codeMessage}}) // Old email
          sendEmail({email:newEmail,type:"CODE",payload:{name:user.name,verificationCode:newEmailCode,codeMessage}})  // New email
        });

    return sendResponse(res, 200, "Verification codes sent to both old and new email addresses");

  } catch (error) {
    logger.error(`Error in requestEmailUpdate: ${error.message}`);
    return sendResponse(res,constants.RESPONSE_INT_SERVER_ERROR,error.message,{},constants.UNHANDLED_ERROR);
  }
};





const emailUpdate = async (req, res) => {
  try {
    const { oldEmailCode, newEmailCode } = req.body;

    if (!oldEmailCode || !newEmailCode) {
      return sendResponse(
        res,
        constants.RESPONSE_BAD_REQUEST,
        "Please enter both verification codes"
      );
    }

    await updateUserEmail({
      user: req.user,
      oldEmailCode,
      newEmailCode
    });

    return sendResponse(
      res,
      constants.RESPONSE_SUCCESS,
      "Email updated successfully"
    );
  } catch (error) {
    logger.error(`Email update error: ${error.message}`);
    return sendResponse(
      res,
      constants.RESPONSE_BAD_REQUEST,
      error.message
    );
  }
};














export{
    requestEmailUpdate,
    emailUpdate
}