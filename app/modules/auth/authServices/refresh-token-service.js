import jwt from "jsonwebtoken";
import CONFIG from "../../../../config/config.js";
import jwtGenerator from "../../../utils/generate-token.js";


const userPayloadMapper = {
  doctor: (decoded) => ({ doctorId: decoded.doctorId }),
  patient: (decoded) => ({ patientId: decoded.patientId })
};


export const refreshTokenService=(refreshToken)=>{

    const decoded = jwt.verify(
    refreshToken,
    CONFIG.JWT_REFRESH_SECRET_KEY
    );
    
    const payload = userPayloadMapper[decoded.TO](decoded);
    

    const newAccessToken = jwtGenerator(
    {...payload, TO: decoded.TO },
    CONFIG.JWT_SECRET_KEY,
    CONFIG.JWT_REFRESH_TIME,
    CONFIG.JWT_REFRESH_TIME_TYPE
    );
    

    return newAccessToken
}