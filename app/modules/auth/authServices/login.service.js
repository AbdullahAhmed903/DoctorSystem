import { sendEmail } from "../../../utils/emails/email-service.js";
import { CustomError } from "../../../utils/error-handling.js";
import jwtGenerator from "../../../utils/generate-token.js";
import { constants, sendResponse } from "../../../utils/utills-service.js";
import bcrypt from 'bcryptjs';
import CONFIG from "../../../../config/config.js";
import logger from "../../../../config/logger.js";











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
                const token=jwtGenerator({[`${role}Id`]: user[`${role}Id`], TO: role },CONFIG.JWT_SECRET_KEY,1,"h");
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
