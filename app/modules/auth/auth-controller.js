import jwt from "jsonwebtoken";
import CONFIG from "../../../config/config.js";
import { constants, randomNumber, sendResponse } from "../../utils/utills-service.js";
import logger from "../../../config/logger.js";
import patientModel from "../../DB/models/patient-schema.js";
import {  checkUserType, createVerificationCode, findUserByIdentifier, findVerificationCode, loginUser, validateIdentifier, verifyEmailRole } from "./auth-service.js";
import { asyncHandler, CustomError } from "../../utils/error-handling.js";
import Doctor from "../../DB/models/doctor-schema.js";
import { sendEmail } from "../../utils/emails/email-service.js";
import verificationModel from "../../DB/models/verification-model.js";
import { refreshTokenService } from "./authServices/refresh-token-service.js";
import { createNewUser } from "./authServices/signup-user-service.js";









const signUpDoctor =asyncHandler(async (req, res) => {
    const response = await createNewUser({
      model: Doctor,
      data: req.body,
      role: "doctor",
      idPrefix: "Doctor",
      req,
    });
    
    return sendResponse(res, response.status, response.message);
}) 



const verifyEmail=asyncHandler( async(req,res,next)=>{
        const {token}=req.params;
        if(!token){
            return sendResponse(res,constants.RESPONSE_BAD_REQUEST,"Invalid token")
        }
        else{
            let decoded;
            try {
            decoded = jwt.verify(token, CONFIG.JWT_SECRET_KEY);
            } catch (err) {
            if (err.name === "TokenExpiredError") {
                return sendResponse(res, constants.RESPONSE_UNAUTHORIZED, "Token expired. Please re-register.");
            }
            return sendResponse(res, constants.RESPONSE_BAD_REQUEST, "Invalid or tampered token");
            }
            
            if(decoded.TO==="doctor"){
                return verifyEmailRole("doctorId",decoded,Doctor,res)
            }
            else if (decoded.TO==="patient"){
                
                return verifyEmailRole("patientId",decoded,patientModel,res)
            }
            else{
                return sendResponse(res,constants.RESPONSE_BAD_REQUEST,"SomeThing went wrong")
            }
        }
    }
)



const loginDoctor=async(req,res,next)=>{
      return  loginUser(req,res,Doctor,"doctor","doctorId")
}



const signUpPatient = async (req, res) => {
  try {
    const response = await createNewUser({
      model: patientModel,
      data: req.body,
      role: "patient",
      idPrefix: "Patient",
      req
    });

    return sendResponse(res, response.status, response.message);

  } catch (err) {
    logger.error("Signup error:", err);
    return sendResponse(res, 500, "Internal Server Error");
  }
};



const loginPatient=asyncHandler(async(req,res,next)=>{
        return loginUser(req,res,patientModel,"patient","patientId")
}
)


const forgetPassword=asyncHandler(async(req,res)=>{
  const {identifier ,userType}=req.body;
  const identifierType = validateIdentifier(identifier);
  
  const ModelType=checkUserType[userType]
    if (!ModelType) {
    throw new CustomError("Invalid user type", 400);
  }
    const user = await findUserByIdentifier(ModelType, identifierType, identifier);

    if (user){
      const verificationCode=await createVerificationCode(user,userType)      
      sendEmail({email:user.email,type:"CODE",payload:{name:user.name,verificationCode,codeMessage:"You recently requested to reset your account password"}})
      return sendResponse(res,constants.RESPONSE_SUCCESS,"code sent to email")
    }
    return sendResponse(res,constants.RESPONSE_NOT_FOUND,"User not found")
})


const resetPassword=asyncHandler(async(req,res)=>{
  const {code,newpassword,identifier,userType}=req.body
    const identifierType = validateIdentifier(identifier);
  
  const ModelType=checkUserType[userType]
    if (!ModelType) {
    throw new CustomError("Invalid user type", 400);
  }
    const user = await findUserByIdentifier(ModelType, identifierType, identifier);

    if(!user){
       return sendResponse(res, 404, "User not found");
    }
    const codeRecord=await findVerificationCode(code,user,userType)
      if (!codeRecord) {
    return sendResponse(res, 400, "Invalid verification code");
  }

  // Check expiration
  if (Date.now() > codeRecord.expiresAt) {
    return sendResponse(res, 400, "Verification code expired");
  }

  // Update user password
  user.password = newpassword; // your virtual setter will hash it
  
  await user.save();
  await verificationModel.deleteOne({ _id: codeRecord._id });

  return sendResponse(res, 200, "Password reset successfully");
})


const refreshToken = asyncHandler(async (req, res) => {

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new CustomError(
      "No Refresh Token",
      constants.RESPONSE_BAD_REQUEST
    );
  }

  const newAccessToken = refreshTokenService(refreshToken)

  sendResponse(
    res,
    constants.RESPONSE_SUCCESS,
    "New Access Token",
    { token: newAccessToken }
  );
});




export{
    signUpDoctor,
    verifyEmail,
    loginDoctor,
    signUpPatient,
    loginPatient,
    forgetPassword,
    resetPassword,
    refreshToken
}