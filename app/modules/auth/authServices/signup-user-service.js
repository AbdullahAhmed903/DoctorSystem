import { CustomError } from "../../../utils/error-handling.js";
import jwtGenerator from "../../../utils/generate-token.js";
import { sendEmail } from "../../../utils/emails/email-service.js";
import { constants, generateUserId } from "../../../utils/utills-service.js";
import logger from "../../../../config/logger.js";
import CONFIG from "../../../../config/config.js";




const userPayloadMapper = {
  doctor: (savedUser) => ({ doctorId: savedUser.doctorId }),
  patient: (savedUser) => ({ patientId: savedUser.patientId })
};




const sendUserEmail=(req,token,data)=>{
    const link=`${req.protocol}://${req.headers.host}/api/v1/auth/verifyEmail/${token}`;
    sendEmail({email:data.email,type:"VERIFY_EMAIL",payload:{email:data.email,name:data.name,link:link}})
    .then(() => logger.info(`Verification email sent to ${data.email}`))
    .catch(err => logger.error("Email send error:", err));
}




export const createNewUser = async ({ model, data, idPrefix, role, req }) => {

  const existing = await model.findOne({ email: data.email }).lean();

  if (existing) {
    throw new CustomError("User already exists", constants.RESPONSE_BAD_REQUEST);
  }

  // Add dynamic ID (doctorId, patientId)
  data[`${role}Id`] = generateUserId(idPrefix)

  const newUser = new model(data);
  const savedUser = await newUser.save();
  
    
  // Generate token
    const payload = userPayloadMapper[role](savedUser);
    const token = jwtGenerator(
    { ...payload, TO: role },
    CONFIG.JWT_SECRET_KEY,
    CONFIG.JWT_EXPIRES_TIME,
    CONFIG.JWT_EXPIRES_TIME_TYPE
    );

  // Send email
    sendUserEmail(req,token,data)

    return {
    status: constants.RESPONSE_CREATED,
    message: "User registered successfully. Please check your email.",
  };
};