import appointmentModel from "../../DB/models/appointment-schema.js";
import { asyncHandler, CustomError } from "../../middlewares/error-handling.js";
import { CacheService, constants, sendResponse, timeToMinutes } from "../../utils/utills-service.js";
import redisClient from "../../../config/redis.js";
import logger from "../../../config/logger.js";
import { pagination } from "../../utils/pagination.js";
import { appointmentsPipeline, AppointmentStrategyFactory } from "./services/appointments-services.js";
import { changeAppointmentStatus, STATUS_MESSAGES } from "./services/update-appointment-status.js";
import { checkExistAppoitment, checkExistClinic, checkExistDoctor, checkPaymentType, checkWorkingDays, checkWorkingHours, dateValidation, validateBookingInput } from "./services/book-appointment.js";
import Stripe from "stripe";
import CONFIG from "../../../config/config.js"
import { emitUserpaymentSuccess } from "../../bullmq/events/user.event.js";
import clinicModel from "../../DB/models/clinic-schema.js";

const cacheService=new CacheService(redisClient)

const bookAppointment=asyncHandler(async(req,res)=>{
    const {patientId}=req.user;
    const {clinicId}=req.params
    const {doctorId,date,startTime,endTime}=req.body
    const data=req.body
    // ---------- 1. VALIDATION ----------  
    validateBookingInput({doctorId,clinicId,date,startTime,endTime})

    // ---------- 1.5 CHECK EXISTING APPOINTMENT ----------
    await checkExistAppoitment(patientId)

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

                                if (existingEnd <= existingStart) existingEnd += 24 * 60;

                                return (
                                    (existingStart < appointmentHours.appointmentEnd && existingStart >= appointmentHours.appointmentStart) || 
                                    (existingEnd > appointmentHours.appointmentStart && existingEnd <= appointmentHours.appointmentEnd) ||     
                                    (existingStart <= appointmentHours.appointmentStart && existingEnd >= appointmentHours.appointmentEnd)    
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
                                            return sendResponse(res, constants.RESPONSE_CREATED, "Appointment booked successfully",{savedAppointment,session:result.session.url});
                                        }
                                        else{
                                        return sendResponse(res, constants.RESPONSE_CREATED, "Appointment booked successfully",savedAppointment);
                                        }
                            
                    
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
        console.log(id);
        
        const { skip, limit } = pagination(
        req.query.page,
        req.query.size
        );

        const cacheKey = cacheService.buildKey(
      `${role}Appointments`, 
      `${id}:skip${skip}:limit${limit}`
    );
            const cached = await cacheService.getCache(cacheKey);
             
            
    if (cached) {
      logger.info(`⚡ ${role} appointments from cache`);
      return sendResponse(res,constants.RESPONSE_SUCCESS,`${role} Appointments`,JSON.parse(cached));
    }
        const strategy=AppointmentStrategyFactory[role];
         if (!strategy) throw new Error("Invalid role",constants.RESPONSE_BAD_REQUEST);
         
         
       const pipeline = appointmentsPipeline({strategy,id,skip,limit});
        const appointments = await appointmentModel.aggregate(pipeline);
        
            await cacheService.setCache(cacheKey,JSON.stringify(appointments),300); // Cache for 5 minutes
            logger.info(`💾 ${role} Appointments cached for ${role}Id: ${id}`);
                return sendResponse(res,constants.RESPONSE_SUCCESS,appointments.length ? `${role} Appointments` : "No appointments found",appointments);
    })
}




const webHook = asyncHandler(async (req, res) => {
  const stripe = new Stripe(CONFIG.STRIP_KEY);
  const endpointSecret = CONFIG.ENDPOINT_SECRET;
  const signature = req.headers["stripe-signature"];
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      endpointSecret
    );
  } catch (err) {
    logger.error(`⚠️ Webhook signature verification failed: ${err.message}`);
    return res.status(400).json({ error: "Invalid signature" });
  }

  const {appointmentId} =event.data.object.metadata;
  const {email,name} = event.data.object.customer_details;
  
  if (!appointmentId) {
    logger.error("❌ appointmentId missing in metadata");
    return res.json({ received: true });
  }

  // ✅ Payment success
  if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const paymentIntentId = session.payment_intent; 
      await appointmentModel.updateOne(
      { appointmentId,paymentStatus: "pending" },
      { paymentStatus: "paid",paymentIntentId:paymentIntentId }
    );    

    await emitUserpaymentSuccess({email,name,appointmentId})
  }

  // ✅ Checkout expired (no payment)
  if (event.type === "checkout.session.expired") {
    await appointmentModel.updateOne(
      { appointmentId, paymentStatus: "pending" },
      { paymentStatus: "failed" }
    );
  }

  // ✅ REQUIRED Stripe response
  res.json({ received: true });
});



const cancelAppointmentsForSchedule =asyncHandler(async(req,res)=>{
    const {clinicId}=req.params;
    const {doctorId}=req.user;
    const {cancelDate}=req.body
    const clinic=await clinicModel.findOne({clinicId,doctorId,isDeleted:false})
    if(!clinic){
        throw new CustomError("Clinic not found or unauthorized",constants.RESPONSE_UNAUTHORIZED)
    }
    
      const appointments = await appointmentModel.find({
        clinicId,
        date:cancelDate
      }).populate(
        [
            {
                path:"patientDetails",
                select:"name email"
            },
            {
                path:"doctorDetails",
                select:"name email"
            }
        ]
      )
      if(!appointments||!appointments.length){
        return sendResponse(res,constants.RESPONSE_NOT_FOUND,"There IS NO Appointment IN This Date")
      }
      appointments.forEach(app=>{
        emaitCancelAppoitment({appointmentId:app.appointmentId,
            date:app.date,status:app.status,
            paymentStatus:app.paymentStatus,
            typeOfPayment:app.typeOfPayment,
            paymentIntentId:app?.paymentIntentId||null,
            doctorName:app.doctorDetails[0].name,
            doctorEmail:app.doctorDetails[0].email,
            patientName:app.patientDetails[0].email,
            patientEmail:app.patientDetails[0].email,
        })
      })

      sendResponse(res,constants.RESPONSE_SUCCESS,"Schedule cancelled and patients will be notified.")
})


export{
    bookAppointment,
    updateAppointmentStatus,
    appointmentsHandler,
    webHook,
    cancelAppointmentsForSchedule
}
