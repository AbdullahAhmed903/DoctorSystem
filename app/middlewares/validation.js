import { asyncHandler, CustomError } from "../utils/error-handling.js"
import { constants } from "../utils/utills-service.js"


const dataMethod = ['body', 'params', 'query', 'headers']


export const validation=(Schema)=>{
    return asyncHandler((req,res,next)=>{
        const validationArr = []
        dataMethod.forEach(key=>{
            if(Schema[key]){
                const validationResult = Schema[key].validate(req[key], { abortEarly: false }) 
                   if(validationResult?.error){
                validationArr.push(validationResult.error.details)
                }
                else{
                    req[key] = validationResult.value
                }
            }
         
        })

        if(validationArr.length){
            
            throw new CustomError("Validation error", constants.RESPONSE_BAD_REQUEST,validationArr.flat())
        }
        else{
            return next()
        }
        
    })
}