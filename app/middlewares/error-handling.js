import { constants } from "../utils/utills-service.js"


// utils/CustomError.js
export class CustomError extends Error {
  constructor(message, statusCode = 500,errorDetails = null) {
    super(message);
    this.status = statusCode;
    this.errorDetails = errorDetails;    
    Error.captureStackTrace(this, this.constructor); // proper stack trace
  }
}





export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (err instanceof Error) return next(err);
      next(new CustomError(err, constants.RESPONSE_INT_SERVER_ERROR));
    });
  };
};