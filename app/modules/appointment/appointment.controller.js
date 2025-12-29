import appointmentModel from "../../DB/models/appointment-schema.js";
import clinicModel from "../../DB/models/clinic-schema.js";
import Doctor from "../../DB/models/doctor-schema.js";
import { asyncHandler, CustomError } from "../../utils/error-handling.js";
import { constants, sendResponse } from "../../utils/utills-service.js";

import { v4 as uuidv4 } from "uuid";
import redisClient from "../../../config/redis.js";
import logger from "../../../config/logger.js";
import { pagination } from "../../utils/pagination.js";
import { appointmentsPipeline, AppointmentStrategyFactory } from "./services/appointments-services.js";
import { changeAppointmentStatus, STATUS_MESSAGES } from "./services/update-appointment-status.js";
import { checkClinicsWorkingHours, checkExistClinic, checkExistDoctor, dateValidation, validateBookingInput } from "./services/book-appointment.js";

const bookAppointment=asyncHandler(async(req,res)=>{
    const {patientId}=req.user;
    const {clinicId}=req.params
    const {doctorId,typeOfPayment,reasonForVisit,date,startTime,endTime}=req.body

     // ---------- 1. VALIDATION ----------
    if(!doctorId||!clinicId||!date||!startTime||!endTime){
            throw new CustomError("Missing required fields",constants.RESPONSE_BAD_REQUEST)
    }
      // ---------- 2. DOCTOR CHECK ----------
    await checkExistDoctor(doctorId)

        // ---------- 3. CLINIC CHECK ----------
        const existClinic=await checkExistClinic(doctorId,clinicId)

              // ---------- 4. DATE VALIDATION ----------
            if(dateValidation(date)){
                throw new CustomError("This is a past date,Please select a valid date",constants.RESPONSE_BAD_REQUEST)
            }
            
             // ---------- 5. CHECK CLINIC WORKING DAY ----------
          
            const schedule =checkClinicsWorkingHours(date,existClinic)
            if(!schedule){
                throw new CustomError(`Clinic is not open on ${days[dayOfWeek]}`,constants.RESPONSE_BAD_REQUEST)
            }

                // ---------- 6. CHECK CLINIC WORKING HOURS ----------
                if (startTime < schedule.startTime || endTime > schedule.endTime) {
                    throw new CustomError(`Appointment time must be within clinic hours: ${schedule.startTime} - ${schedule.endTime}`,constants.RESPONSE_BAD_REQUEST)
                    }

                             // ---------- 7. CHECK TIME CONFLICT ----------
                            const conflictingAppointment = await appointmentModel.findOne({
                                doctorId,
                                clinicId,
                                date,
                                $or: [
                                    { startTime: { $lt: endTime, $gte: startTime } },
                                    { endTime: { $gt: startTime, $lte: endTime } },
                                    { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: endTime } }] }
                                ]
                            }).lean()

                            if(conflictingAppointment){
                                throw new CustomError("Time slot is already booked",constants.RESPONSE_BAD_REQUEST)
                            }
                                  // ---------- 8. CREATE APPOINTMENT ----------

                                const newAppointment = new appointmentModel({
                                        appointmentId:uuidv4(),
                                        doctorId,
                                        patientId,
                                        clinicId,
                                        date,
                                        startTime,
                                        endTime,
                                        status: "pending",
                                        fees: {
                                            amount: existClinic.fee.amount,
                                            currency: existClinic.fee.feeSign
                                        },
                                        typeOfPayment: typeOfPayment || "cash",
                                        reasonForVisit,
                                        createdBy: "patient"
                                    });

                                    const savedAppointment=await newAppointment.save();

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
