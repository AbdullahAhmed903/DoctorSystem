import CONFIG from "../../../config/config.js";
import jwtGenerator from "../../utils/generate-token.js";
import { constants, randomNumber, sendResponse } from "../../utils/utills-service.js"
import bcrypt from 'bcryptjs';
import logger from "../../../config/logger.js";
import { asyncHandler, CustomError } from "../../utils/error-handling.js";
import patientModel from "../../DB/models/patient-schema.js";
import Doctor from "../../DB/models/doctor-schema.js";
import { sendEmail } from "../../utils/emails/email-service.js";
import verificationModel from "../../DB/models/verification-model.js";
import CryptoJS from "crypto-js";








export const verifyEmailRole=async(roleId,decoded,model,res)=>{
                
               if(!decoded ||!decoded[roleId]){
                        return sendResponse(res,constants.RESPONSE_BAD_REQUEST,"Invalid payload")
                    }
                   else{
                        const updatedUser = await model.findOneAndUpdate(
                        { [roleId]:decoded[roleId], isEmailVerified: false },
                        { isEmailVerified: true },
                        { new: true }
                        );

                        
                        if(!updatedUser){
                        return sendResponse(res,constants.RESPONSE_NOT_FOUND,"User not found or already verified")
                        }
                        else{
                            return sendResponse(res,constants.RESPONSE_SUCCESS,"Email verified successfully")
                        }
            }

}


export const loginUser=async(req,res,model,role,roleId)=>{
        const {email,password}=req.body;
        if(!email||!password){ 
            throw new CustomError("Email and password are required", constants.RESPONSE_BAD_REQUEST);         
            }
            
        const user=await model.findOne({email,isDeleted:false}).select("+encryptedPassword");
        
        if(!user){
                    return sendResponse(res,constants.RESPONSE_NOT_FOUND,"User not found")
                }
                
            const isPasswordCorrect=await bcrypt.compare(password,user.password);
            if(!isPasswordCorrect){
            return sendResponse(res,constants.RESPONSE_UNAUTHORIZED,"Invalid credentials")
            }
                const token=jwtGenerator({[`${role}Id`]: user[`${role}Id`], TO: role },CONFIG.JWT_SECRET_KEY,30,"s");
                const refreshToken=jwtGenerator({ [`${role}Id`]: user[`${role}Id`], TO: role},CONFIG.JWT_REFRESH_SECRET_KEY,7,"d")


                if(!user.isEmailVerified){
                    const link=`${req.protocol}://${req.headers.host}/api/v1/auth/verifyEmail/${token}`;
                    sendEmail({email:email,type:"VERIFY_EMAIL",payload:{email:email,name:user.name,link}})
                    .then(() => logger.info(`Resent verification email to ${email}`))
                    .catch(err => logger.error(`Email send failed to ${email}:`, err));
                    return sendResponse(res,constants.RESPONSE_UNAUTHORIZED,"Email not verified. Please verify your email to login.")
                }
                else{
                    res.cookie('refreshToken', refreshToken, {
                      httpOnly: true,
                      secure: false,
                      sameSite: 'strict',
                      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                    });

                    return sendResponse(res, constants.RESPONSE_SUCCESS, "Login Succeed", {token:token}, []);
                }

}



//.......releated to forget-password..........//
export const validateIdentifier = (identifier) => {
  if (!identifier) throw new CustomError("Identifier required", 400);
  const type = detectIdentifierType(identifier);
  if (!type) throw new CustomError("Invalid identifier", 400);
  return type;
};

const detectIdentifierType =(identifier)=>{
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*\.(com|mail)$/;
      const phoneRegex =/^[0-9]{10,15}$/;
    if(emailRegex.test(identifier)) return "email";
    if(phoneRegex.test(identifier)) return "phone";
    return null
}

export const findUserByIdentifier = async (Model, type, value) => {  
  return Model.findOne({[type]: value, isDeleted: false }).select("-specialization  -experience -certifications -profileImage -gender -availableDays");
};


export const checkUserType={
  patient:patientModel,
  doctor:Doctor

}

const checkUserId={
  doctor:"doctorId",
  patient:"patientId"
}

export const createVerificationCode=async(user,userType)=>{
   let id=checkUserId[userType]   
    
  const verificationCode=randomNumber(6);
    await verificationModel.findOneAndUpdate(
    { userId: user[id], purpose: "FORGET_PASSWORD" },
    {
      code: CryptoJS.HmacSHA512(
        verificationCode.toString(),
        CONFIG.VERIFICATION_CODE_SECRET
      ).toString(CryptoJS.enc.Hex),
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes from now
    },
    { upsert: true, new: true } // create if doesn't exist, return new doc
  );

   return  verificationCode
}

export const findVerificationCode=async(code,user,userType)=>{
    let id=checkUserId[userType]    
    const hashedCode = CryptoJS.HmacSHA512(
    code.toString(),
    CONFIG.VERIFICATION_CODE_SECRET
  ).toString(CryptoJS.enc.Hex);

  const codeRecord = await verificationModel.findOne({
    userId: user[id],
    purpose: "FORGET_PASSWORD",
    code: hashedCode,
  });

  return codeRecord
}


