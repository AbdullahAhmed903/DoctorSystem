import express from 'express';

const router = express.Router();
import * as authController from "./auth-controller.js";
import { validation } from '../../middlewares/validation.js';
import * as authValidators from "./auth-validation.js";
import rateLimition from '../../middlewares/rate-limit.js';

// .......... Doctor Auth Routes  .........//
router.post("/doctor/signup",rateLimition(10,5),validation(authValidators.signUpDoctor),authController.signUpDoctor);
router.get("/verifyEmail/:token",validation(authValidators.verifyEmail),authController.verifyEmail)
router.post("/doctor/login",rateLimition(10,10),validation(authValidators.loginDoctor),authController.loginDoctor);


// .......... Patient Auth Routes  .........//

router.post("/patient/signup",rateLimition(10,5),validation(authValidators.signUpPatient),authController.signUpPatient);
router.post("/patient/login",rateLimition(10,5),validation(authValidators.loginPatient),authController.loginPatient)

router.post("/forget-password",rateLimition(5,5),validation(authValidators.forgetpassword),authController.forgetPassword)

router.post("/reset-password",rateLimition(5,5),validation(authValidators.resetPassword),authController.resetPassword)

router.post("/refresh-token",authController.refreshToken)


router.post("/logout",authController.logout)




export default router;