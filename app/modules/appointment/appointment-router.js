import express from "express";
import * as appointmentRouter from "./appointment.controller.js"
import auth from "../../middlewares/authentication .js";
import rateLimition from "../../middlewares/rate-limit.js";
import { validation } from "../../middlewares/validation.js";
import * as appointmentValidation from "./appointment-validation.js"

const router=express.Router()



router.post("/patient/book-appointment/:clinicId",auth(["patient"]),validation(appointmentValidation.bookAppointmentValidation),rateLimition(10,100),appointmentRouter.bookAppointment)

router.get("/doctor/appointments",auth(["doctor"]),appointmentRouter.appointmentsHandler("doctor"))
router.get("/patient/appointments",auth(["patient"]),appointmentRouter.appointmentsHandler("patient"))

router.patch("/doctor/update-appointment-status/:appointmentId",auth(["doctor"]),validation(appointmentValidation.updateAppointmentStatusValidation),appointmentRouter.updateAppointmentStatus)

router.post("/webhook",express.raw({type:'application/json'}),appointmentRouter.webHook)

router.post("/doctor/cancel-appointment/:clinicId",auth(["doctor"]),validation(appointmentValidation.cancelAppintment),appointmentRouter.cancelAppointmentsForSchedule )












export default router