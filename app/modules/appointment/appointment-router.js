import express from "express";
import * as appointmentRouter from "./appointment.controller.js"
import auth from "../../middlewares/authentication .js";
import rateLimition from '../../utils/rate-limit.js';

const router=express.Router()



router.post("/patient/book-appointment/:clinicId",auth(["patient"]),rateLimition(10,100),appointmentRouter.bookAppointment)

router.get("/doctor/appointments",auth(["doctor"]),appointmentRouter.appointmentsHandler("doctor"))
router.get("/patient/appointments",auth(["patient"]),appointmentRouter.appointmentsHandler("patient"))

router.patch("/doctor/update-appointment-status/:appointmentId",auth(["doctor"]),appointmentRouter.updateAppointmentStatus)













export default router