import Doctor from "../../../DB/models/doctor-schema.js";
import patientModel from "../../../DB/models/patient-schema.js";
import verificationModel from "../../../DB/models/verification-model.js";
import { CustomError } from "../../../middlewares/error-handling.js";
import { constants, randomNumber } from "../../../utils/utills-service.js";
import CryptoJS from "crypto-js";
import CONFIG from "../../../../config/config.js";
import { sendOTP } from "../../../service/twilio-service.js";
import { sendEmail } from "../../../service/email/email-service.js";









//.......releated to forget-password..........//
export const validateIdentifier = (identifier) => {
  if (!identifier) throw new CustomError("Identifier required", constants.RESPONSE_BAD_REQUEST);
  const type = detectIdentifierType(identifier);
  if (!type) throw new CustomError("Invalid identifier", constants.RESPONSE_BAD_REQUEST);
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




const otpSenders = {
  phone: ({ phone, verificationCode }) =>
    sendOTP(phone, verificationCode),

  email: ({ email, name, verificationCode }) =>
    sendEmail({
      email,
      type: "CODE",
      payload: {
        name,
        verificationCode,
        codeMessage: "You recently requested to reset your account password"
      }
    })
};


export const sendUserOtp = (identifierType, userData) => {
  
  const sender = otpSenders[identifierType];  

  if (!sender) {
    throw new Error(`Unsupported identifier type: ${identifierType}`);
  }

  return sender(userData);
};
