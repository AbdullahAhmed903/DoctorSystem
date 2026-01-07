import express from "express";
import * as clinicController from "./clinic-controller.js";
import auth from "../../middlewares/authentication .js";
import rateLimition from "../../service/rate-limit.js";
import { validation } from "../../middlewares/validation.js";
import * as clinicValidation from "./clinic-validation.js"

const router = express.Router();

router.post("/add-clinic", auth(["doctor"]), clinicController.addClinic);
router.get("/doctor-clinics",auth(["doctor"]),clinicController.getDoctorClinics)
router.get("/:clinicId",auth(["doctor"]),clinicController.getOneClinicById)
router.put("/doctor/update-clinic/:clinicId",rateLimition(5,15),auth(["doctor"]),validation(clinicValidation.updateClinicSchema),clinicController.updateClinicInfo)














export default router