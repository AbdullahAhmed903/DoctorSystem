import winston, { createLogger, format, transports } from 'winston';  
import CONFIG from './config.js';





// const consoleFormat =format.combine(
//   format.colorize(),
//   format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
//   format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
// );

class consoleFormat{
  static getFormat(){
    return format.combine(
      format.colorize(),
      format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss A' }),
      format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
);
  }
}


// File format (structured JSON)
const fileFormat =format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json()
);

const logger=createLogger({
    level: CONFIG.LOG_LEVEL||"info",
    format:fileFormat,
      transports: [
        new winston.transports.File({ filename: CONFIG.LOG_FILE_LOCATION ||'logs/doctor-system',maxsize: 5242880, maxFiles: 5,handleExceptions:true  }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error', maxsize: 5242880, maxFiles: 5,handleExceptions:true  }),
    ],
    exitOnError: false, 
})



if (CONFIG.NODE_ENV!== "production") {
  logger.add(
    new transports.Console({
        level: CONFIG.LOG_LEVEL||"debug",
        format:consoleFormat.getFormat(),
        handleExceptions:true,
        stack:true
    })
  );
}


logger.stream = {
  write: (message) => logger.info(message.trim()),
};









export default logger;
