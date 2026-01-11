import appointmentModel from "../../../DB/models/appointment-schema.js";
import clinicModel from "../../../DB/models/clinic-schema.js"
import Doctor from "../../../DB/models/doctor-schema.js"
import patientModel from "../../../DB/models/patient-schema.js";
import { createCheckoutSession } from "../../../service/payment-service.js";
import { CustomError } from "../../../utils/error-handling.js"
import { constants, generateUserId, timeToMinutes } from "../../../utils/utills-service.js"
import { v4 as uuidv4 } from "uuid";




// appointment.validator.js
export const validateBookingInput = ({
  doctorId,
  clinicId,
  date,
  startTime,
  endTime
}) => {
  if (!doctorId || !clinicId || !date || !startTime || !endTime) {
    throw new CustomError(
      "Missing required fields",
      constants.RESPONSE_BAD_REQUEST
    );
  }
};


export const checkExistDoctor=async(doctorId)=>{
    const existDoctor=await Doctor.findOne({doctorId}).select("email name doctorId").lean()
    if(!existDoctor) {
        throw new CustomError("Doctor not Found",constants.RESPONSE_BAD_REQUEST)
    }
    return existDoctor
}


export const checkExistClinic=async(doctorId,clinicId)=>{
        const existClinic=await clinicModel.findOne({doctorId,clinicId:clinicId,status:"active"}).lean()
            if(!existClinic){
                    throw new CustomError("Clinic not found or inactive",constants.RESPONSE_BAD_REQUEST)
                }
        return existClinic
}

export const checkWorkingDays=(date,existClinic)=>{
        const appointmentDate = new Date(date);
        appointmentDate.setHours(0, 0, 0, 0);
        const dayName  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][appointmentDate.getDay()];        
        const schedule =existClinic.weeklySchedule.find(sechule=>sechule.day===dayName)
          if(!schedule){
                const scheduleStrings = existClinic.weeklySchedule.map(
                    s => `${s.day}: open:${s.startTime}- close: ${s.endTime}`
                );
                throw new CustomError(
                    `Clinic is Closed , it open on ${scheduleStrings.join(" , ")}`,
                    constants.RESPONSE_BAD_REQUEST
                );
        }
        else{
          return schedule
          
        }

}




export const checkWorkingHours=({startTime,endTime,schedule})=>{
       let appointmentStart = timeToMinutes(startTime);
                let appointmentEnd = timeToMinutes(endTime);
                let clinicStart = timeToMinutes(schedule.startTime);
                let clinicEnd = timeToMinutes(schedule.endTime);

                if (clinicEnd <= clinicStart) {
                        // Add 24 hours to end time to represent next day
                        clinicEnd += 24 * 60;
                        // Also adjust appointment end if it is before start
                        if (appointmentEnd < appointmentStart) {
                            appointmentEnd += 24 * 60;
                        }
                    }
            if (appointmentStart < clinicStart || appointmentEnd > clinicEnd) {
                    throw new CustomError(
                        `Appointment time must be within clinic hours: ${schedule.startTime} - ${schedule.endTime}`,
                        constants.RESPONSE_BAD_REQUEST
                    );
                }

                else{
                  return {appointmentStart,appointmentEnd}
                }
}





export const dateValidation=(userDate)=>{
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointmentDate = new Date(userDate);
    appointmentDate.setHours(0, 0, 0, 0);

    return (appointmentDate<today)
}



const paymentTypesService = {
  cash: async ({patientId, clinicId,doctorId, date, startTime, endTime, reasonForVisit,appointmentPrice,appointmentCurrency }) => {
    const newAppointment = new appointmentModel({
      appointmentId:generateUserId("appointment"),
      doctorId,
      patientId,
      clinicId,
      date,
      startTime,
      endTime,
       fees: {
              amount: appointmentPrice,
              currency: appointmentCurrency
          },
      status: "pending",
      typeOfPayment: "cash",
      reasonForVisit,
      createdBy: "patient",
    });
     return {newAppointment};
  },

  card: async ({patientId, clinicId,doctorId, date, startTime, endTime, reasonForVisit,doctorName,appointmentPrice }) => {
    const patientData=await patientModel.findOne({patientId}).select("email name").lean()
    const appointmentId=uuidv4()
    const session =await createCheckoutSession({customerEmail:patientData.email,doctorName,appointmentId,price:appointmentPrice})
    console.log(session);
    
    const newAppointment = new appointmentModel({
      appointmentId,
      doctorId,
      patientId,
      clinicId,
      date,
      startTime,
      endTime,
      status: "pending",
      typeOfPayment: "credit_card",
      reasonForVisit,
      createdBy: "patient",
      stripeSessionId: session.id
    });
      return {newAppointment,session}
  },
};



export const checkPaymentType = async (data, patientId, clinicId,doctorData,clinicFess) => {
  // destructure all needed fields
  // const { doctorId, date, startTime, endTime, reasonForVisit, typeOfPayment } = data;
  

  if (!paymentTypesService[data.typeOfPayment]) {
    throw new Error("Invalid payment type");
  }

  const appointment = await paymentTypesService[data.typeOfPayment]({
    patientId,
    clinicId,
    ...data,
    appointmentPrice:clinicFess.amount,
    appointmentCurrency:clinicFess.currency,
    doctorName:doctorData.name,

  });

  return appointment;
};
