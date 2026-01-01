import rateLimit from "express-rate-limit";
import { sendResponse } from "../utils/utills-service.js";




const rateLimition=(windowsTime,numberOfRequests)=>rateLimit({
    windowMs:windowsTime*60*1000, //15 minutes
    max:numberOfRequests, //limit each IP to 20 requests per windowMs
    message:{message:"Too many requests from this IP, please try again after 15 minutes"},
     standardHeaders: true,    // Return rate limit info in headers
     legacyHeaders: false,
       handler: (req, res) => {
    sendResponse(res,429,"Too many requests from this IP, please try again after 15 minutes")
  },
})


export default rateLimition;