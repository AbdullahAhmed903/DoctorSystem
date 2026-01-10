import jwt from "jsonwebtoken";
import CONFIG from "../../config/config.js";
import { v4 as uuidv4 } from 'uuid';
// import redisClient from "../../config/redis.js";


const constants={
        UNHANDLED_ERROR: 'Encountered an error while processing...',
    VALIDATION_ERROR: 'Encountered an validation error while processing...',

    RESPONSE_SUCCESS: 200,
    RESPONSE_CREATED: 201,
    RESPONSE_BAD_REQUEST: 400,
    RESPONSE_UNAUTHORIZED: 401,
    RESPONSE_FORBIDDEN: 403,
    RESPONSE_INT_SERVER_ERROR: 500,
    RESPONSE_NOT_FOUND: 404,
    RESPONSE_CONFLICT:409
}






const sendResponse=(res,statusCode,message,data=null,errors=null,stack=null)=>{
    let errorList=[]
    if(errors){
        if(Array.isArray(errors)){
            errorList=errors.map(err=>{
                return {message:typeof err==='string'?err:err.message||'Validation error',key:err.key||null}
            })
        }
        else if(typeof errors==='string'){
            errorList.push({message:errors,key:null})
        }

        else if(typeof errors==='object' && errors.errors){
            for(const key in errors.errors){
                errorList.push({message:errors.errors[key].message,key:key})
            }
    }
}
  return res.status(statusCode).json({
        success:!(statusCode>=400),
        message,
        data,
        errors:errorList.length?errorList:null,
        stack:stack||null
    })
}







const randomNumber=(length)=>{
 return Math.floor(Math.random() * (10**length - 10**(length-1))) + 10**(length-1);
} 





const generateUserId = (prefix) => `${prefix}${uuidv4()}`;



export class CacheService  {
      constructor(redisClient) {
    this.redis = redisClient;
  }
   buildKey(prefix, id) {
    return `${prefix}:${id}`;
  }

  async deleteCache(key) {
    await this.redis.del(key);
  }

    async getCache(cashKey){
         return this.redis.get(cashKey);
    }

      async setCache(key, value, ttlSeconds = 300) {
    await this.redis.set(
      key,
      JSON.stringify(value),
      { EX: ttlSeconds }
    );
  }
}


const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
};




export {sendResponse,constants,randomNumber,generateUserId,timeToMinutes}