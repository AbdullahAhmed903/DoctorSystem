import clinicModel from "../../../DB/models/clinic-schema.js"
import Doctor from "../../../DB/models/doctor-schema.js"
import { CustomError } from "../../../utils/error-handling.js"
import { constants } from "../../../utils/utills-service.js"




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
    const existDoctor=await Doctor.findOne({doctorId}).lean()
    if(!existDoctor) {
        throw new CustomError("Doctor not Found",constants.RESPONSE_BAD_REQUEST)
    }
    return existDoctor
}


export const checkExistClinic=async(doctorId,clinicId)=>{
        const existClinic=await clinicModel.findOne({doctorId,clinicId:clinicId,isActive:true}).lean()
            if(!existClinic){
                    throw new CustomError("Clinic not found or inactive",constants.RESPONSE_BAD_REQUEST)
                }
        return existClinic
}

export const checkClinicsWorkingHours=(date,existClinic)=>{
        const appointmentDate = new Date(date);
        appointmentDate.setHours(0, 0, 0, 0);
        const dayName  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][appointmentDate.getDay()];
        const schedule =existClinic.weeklySchedule.find(sechule=>sechule.day===dayName)

        return schedule
}


export const dateValidation=(userDate)=>{
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointmentDate = new Date(userDate);
    appointmentDate.setHours(0, 0, 0, 0);

    return (appointmentDate<today)
}
