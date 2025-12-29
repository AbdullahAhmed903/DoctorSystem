import express from "express";
import auth from "../../middlewares/authentication .js";
import * as emailUpdateController from "./email-update.controller.js"
import rateLimition from "../../utils/rate-limit.js";
const routers=express.Router();


// routers.post("/doctor/update-email",auth(["doctor"]),emailUpdateController.requestEmailUpdate)

routers.post("/doctor/update-email-request",auth(["doctor"]),rateLimition(5,20),emailUpdateController.requestEmailUpdate)
routers.patch("/doctor/update-email/",auth(["doctor"]),emailUpdateController.emailUpdate)







export default routers