import CONFIG from "../../config/config.js";
import tokenSchema from "../modules/auth/token-schema.js";
import { constants, sendResponse } from "../utils/utills-service.js";
import jwt from "jsonwebtoken";







    const auth=(allowRoles=[])=>{
        return async (req,res,next)=>{
            try {
                
                const authHeader=req.headers['authorization']||req.headers['Authorization'];
                if(!authHeader||!authHeader.startsWith('Bedo_')){
                    return sendResponse(res,constants.RESPONSE_UNAUTHORIZED,"Unauthorized access")
                    
                }
                else{
                    
                    const token=authHeader.split('Bedo_')[1];
                    
                    const decoded=jwt.verify(token,CONFIG.JWT_SECRET_KEY);                    

                    // let tokenExists                     
                    // if(decoded.TO==="doctor"){
                        
                    //      tokenExists=await tokenSchema.findOne({doctorId:decoded.doctorId}).lean();
                    // }
                    // else{
                    //     tokenExists=await tokenSchema.findOne({patientId:decoded.patientId})                        
                    // }
                    //     if(!tokenExists){
                    //         return sendResponse(res,constants.RESPONSE_UNAUTHORIZED,"Invalid token")
                    //         }
                    req.user=decoded;
                    if(allowRoles.length&&!allowRoles.includes(decoded.TO)){
                        return sendResponse(res,constants.RESPONSE_FORBIDDEN,"Forbidden access")
                    }
                    next()
                
                    
                }
            } catch (error) {
                if (error.name === "TokenExpiredError") {
                return sendResponse(res, constants.RESPONSE_UNAUTHORIZED, "Token expired. Please log in again.");
                }
                
                return sendResponse(res, constants.RESPONSE_UNAUTHORIZED, "Invalid token.");
            }
        }

    }

    export default auth;