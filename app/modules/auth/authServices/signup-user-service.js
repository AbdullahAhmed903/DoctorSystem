import { CustomError } from "../../../middlewares/error-handling.js";
import jwtGenerator from "../../../utils/generate-token.js";
import { constants, generateUserId } from "../../../utils/utills-service.js";
import logger from "../../../../config/logger.js";
import CONFIG from "../../../../config/config.js";
import { emitUserSignup } from "../../../bullmq/events/user.event.js";
// import { emitUserSignup } from "../../../bullmq/events/user.event.js";





const userPayloadMapper = {
  doctor: (savedUser) => ({ doctorId: savedUser.doctorId }),
  patient: (savedUser) => ({ patientId: savedUser.patientId })
};





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

  await emitUserSignup({host:req.headers.host,protocol:req.protocol,token,data})
  
    return {
    status: constants.RESPONSE_CREATED,
    message: "User registered successfully. Please check your email.",
  };
};