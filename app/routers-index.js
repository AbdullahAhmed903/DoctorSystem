import authRouter from "./modules/auth/auth-router.js";
import doctorRouter from "./modules/doctor/doctor.router.js";
import emailUpdateRouter from "./modules/emailUpdate/email-update.router.js"
import clinicRouter from "./modules/clinics/clinic-router.js";
import appointmentRouter from "./modules/appointment/appointment-router.js";

export const v1routes=(app)=>{
    app.use("/api/v1/auth",authRouter);
    app.use("/api/v1/doctor",doctorRouter);
    app.use("/api/v1/email",emailUpdateRouter)
    app.use("/api/v1/clinic",clinicRouter)
    app.use("/api/v1/appointment",appointmentRouter)

}
