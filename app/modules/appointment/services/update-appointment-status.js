import { CustomError } from "../../../middlewares/error-handling.js";
import { constants } from "../../../utils/utills-service.js";



const STATUS_TRANSITIONS = {
    confirmed: ["pending", "cancelled", "completed"],
    cancelled: ["pending", "confirmed", "completed"],
    completed: ["pending", "confirmed", "cancelled"]
};

export const STATUS_MESSAGES = {
  confirmed: "Appointment Confirmed Success",
  cancelled: "Appointment Cancelled Success",
  completed: "Appointment Completed Success"
};

export const changeAppointmentStatus=async(appointmentId,doctorId,model,status)=>{
    const allowedStatuses = STATUS_TRANSITIONS[status];

    const updatedAppointment = await model.findOneAndUpdate(
            { appointmentId, doctorId, status: { $in: allowedStatuses } },
            { $set: { status } },
            { new: true }
        );
        if (!updatedAppointment) {
            throw new CustomError("Appointment cannot be updated", constants.RESPONSE_BAD_REQUEST);
        }
            
            return updatedAppointment

}