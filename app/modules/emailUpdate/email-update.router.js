import express from "express";
import auth from "../../middlewares/authentication .js";
import * as emailUpdateController from "./email-update.controller.js"
import { validation } from "../../middlewares/validation.js";
import * as emailValidation from "./email-update-validation.js"
import rateLimition from "../../middlewares/rate-limit.js";
const routers=express.Router();



routers.post("/update-email-request",auth(["doctor","patient"]),rateLimition(5,20),validation(emailValidation.updateEmailRequestValidation),emailUpdateController.requestEmailUpdate)
routers.patch("/update-email",auth(["doctor","patient"]),rateLimition(5,20),validation(emailValidation.emailUpdateValidation),emailUpdateController.emailUpdate)







export default routers