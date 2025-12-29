import express from "express";
import * as clinicController from "./clinic-controller.js";
import auth from "../../middlewares/authentication .js";

const router = express.Router();

router.post("/add-clinic", auth(["doctor"]), clinicController.addClinic);
router.get("/doctor-clinics",auth(["doctor"]),clinicController.getDoctorClinics)













export default router