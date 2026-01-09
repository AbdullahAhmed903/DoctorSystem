import appointmentModel from "../../DB/models/appointment-schema.js";
import { asyncHandler, CustomError } from "../../utils/error-handling.js";
import { constants, sendResponse, timeToMinutes } from "../../utils/utills-service.js";
import redisClient from "../../../config/redis.js";
import logger from "../../../config/logger.js";
import { pagination } from "../../utils/pagination.js";
import { appointmentsPipeline, AppointmentStrategyFactory } from "./services/appointments-services.js";
import { changeAppointmentStatus, STATUS_MESSAGES } from "./services/update-appointment-status.js";
import { checkExistClinic, checkExistDoctor, checkPaymentType, checkWorkingDays, checkWorkingHours, dateValidation, validateBookingInput } from "./services/book-appointment.js";

const bookAppointment=asyncHandler(async(req,res)=>{
    const {patientId}=req.user;
    const {clinicId}=req.params
    const {doctorId,date,startTime,endTime}=req.body
    const data=req.body
    // ---------- 1. VALIDATION ----------  
    validateBookingInput({doctorId,clinicId,date,startTime,endTime})

    // ---------- 2. DOCTOR CHECK ----------
    const doctorData=await checkExistDoctor(doctorId)    

    // ---------- 3. CLINIC CHECK ----------
    const existClinic=await checkExistClinic(doctorId,clinicId)

    // ---------- 4. DATE VALIDATION ----------
    if(dateValidation(date)){
        throw new CustomError("This is a past date,Please select a valid date",constants.RESPONSE_BAD_REQUEST)
    }
            
    // ---------- 5. CHECK CLINIC WORKING DAYS ----------
    
    const schedule =checkWorkingDays(date,existClinic)


    // ---------- 6. CHECK CLINIC WORKING HOURS ----------
    const appointmentHours=checkWorkingHours({startTime,endTime,schedule})

    // ---------- 7. CHECK TIME CONFLICT ----------
    const appointments = await appointmentModel.find({
        clinicId,
        doctorId,
        date,
    })
                                const conflict = appointments.find(app => {
                                let existingStart = timeToMinutes(app.startTime);
                                let existingEnd = timeToMinutes(app.endTime);

                                // handle cross-midnight for existing appointment
                                if (existingEnd <= existingStart) existingEnd += 24 * 60;

                                return (
                                    (existingStart < appointmentHours.appointmentEnd && existingStart >= appointmentHours.appointmentStart) || // overlaps start
                                    (existingEnd > appointmentHours.appointmentStart && existingEnd <= appointmentHours.appointmentEnd) ||     // overlaps end
                                    (existingStart <= appointmentHours.appointmentStart && existingEnd >= appointmentHours.appointmentEnd)    // completely covers
                                );
                                });

                                if (conflict) {
                                throw new CustomError(
                                    "This appointment time is already booked",
                                    constants.RESPONSE_BAD_REQUEST
                                );
                                }
                                  // ---------- 8. CREATE APPOINTMENT ----------
                                 const result=await checkPaymentType(data,patientId,clinicId,doctorData,existClinic.fees)                                
                                    const savedAppointment=await result.newAppointment.save();
                                        if(result.session){
                                            console.log("gggggggggggggggg");
                                            
                                            savedAppointment.session=result.session
                                        }
                                      return sendResponse(res, constants.RESPONSE_CREATED, "Appointment booked successfully",savedAppointment);
                            
                    
})






const updateAppointmentStatus=asyncHandler(async(req,res,next)=>{
    const {doctorId}=req.user;
    const {appointmentId}=req.params;
    const {status}=req.body

    if (!status || !['confirmed', 'cancelled', 'completed'].includes(status)) {
        throw new CustomError("Invalid status", constants.RESPONSE_BAD_REQUEST);
    }

    const updatedAppointment = await changeAppointmentStatus(appointmentId, doctorId, appointmentModel, status);

    sendResponse(res, constants.RESPONSE_SUCCESS, STATUS_MESSAGES[status], updatedAppointment);
})



const appointmentsHandler=(role)=>{
    return asyncHandler(async(req,res,next)=>{
        const id=role==="doctor"?req.user.doctorId:req.user.patientId
        const { skip, limit } = pagination(
        req.query.page,
        req.query.size
        );

          const cacheKey = `${role}Appointments:${id}`;
             const cached = await redisClient.get(cacheKey);
    if (cached) {
      logger.info(`⚡ ${role} appointments from cache`);
      return sendResponse(res,constants.RESPONSE_SUCCESS,`${role} Appointments`,JSON.parse(cached));
    }
        const strategy=AppointmentStrategyFactory[role];
         if (!strategy) throw new Error("Invalid role",constants.RESPONSE_BAD_REQUEST);
       const pipeline = appointmentsPipeline({strategy,id,skip,limit});
        const appointments = await appointmentModel.aggregate(pipeline);
            await redisClient.setEx(cacheKey, 600, JSON.stringify(appointments));
            logger.info(`💾 ${role} Appointments cached for ${role}Id: ${id}`);
                return sendResponse(res,constants.RESPONSE_SUCCESS,appointments.length ? `${role} Appointments` : "No appointments found",appointments);
    })
}




export{
    bookAppointment,
    updateAppointmentStatus,
    appointmentsHandler
}
