import { constants, sendResponse } from "../../../utils/utills-service.js";


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
