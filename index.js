import express from "express";
import CONFIG from "./config/config.js";
import logger from "./config/logger.js";
import morgan from "morgan";
import { v1routes } from "./app/routers-index.js";
import { constants, sendResponse } from "./app/utils/utills-service.js";
import cookieParser from "cookie-parser";
import connectiondb from "./app/DB/connection-db.js";
import cors from "cors"

const corsConfig={
  origin:"*",
  Credential:true,
  methods:["GET","POST","PUT","DELETE"]
}

const app=express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsConfig))
new connectiondb()
morgan.token('id', (req) => req.id);
app.use(
  morgan(':id :method :url :status :response-time ms', { stream: logger.stream })
);


v1routes(app)


// ✅ DB connection (serverless-safe)


// ✅ Logging
morgan.token("id", (req) => req.id || "anon");
app.use(morgan(":id :method :url :status :response-time ms", {
  stream: logger.stream,
}));

// ✅ Health check
app.get("/", (req, res) => {
  res.json({ message: "Doctor System API running 🚀" });
});

// ✅ Routes
v1routes(app);

// ✅ 404
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  const statusCode = err.status || constants.RESPONSE_INT_SERVER_ERROR;
  
  if (CONFIG.NODE_ENV === "development") {
    if(err.message==="Validation error")
      {
           sendResponse(res, statusCode, err.message, {},err.errorDetails, err.stack);
           console.log(err.errorDetails);
           logger.error(
            `${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}\n${err.stack}`
          )
           
      }
      else{
            sendResponse(res, statusCode, err.message, {}, err.stack);
          logger.error(
            `${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}\n${err.stack}`
          )
      }
      

  } else {
    // Production: no stack trace
    sendResponse(res, statusCode, err.message);
    logger.error(`${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }
});


export default app

