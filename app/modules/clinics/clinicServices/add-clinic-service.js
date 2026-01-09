import clinicModel from "../../../DB/models/clinic-schema.js";
import { CustomError } from "../../../utils/error-handling.js"
import { constants, generateUserId, sendResponse } from "../../../utils/utills-service.js"
import { v4 as uuidv4 } from 'uuid';



export const checkRequiredFields = (data) => {
  const required = ["name", "address", "contactNumber", "fees", "weeklySchedule"];

  for (const field of required) {
    if (!data[field]) {
      throw new CustomError(
        `${field} is required`,
        constants.RESPONSE_BAD_REQUEST
      );
    }
  }

  if (!Array.isArray(data.weeklySchedule) || data.weeklySchedule.length === 0) {
    throw new CustomError(
      "Weekly schedule is required",
      constants.RESPONSE_BAD_REQUEST
    );
  }
};






export class ClinicPolicy {
  constructor(clinicModel) {
    this.clinicModel = clinicModel;
  }

  async checkClinicLimit(doctorId, max = 3) {
    const count = await this.clinicModel.countDocuments({
      doctorId,
      isDeleted: false
    });

    if (count >= max) {
      throw new CustomError(
        "Clinic limit reached",
        constants.RESPONSE_BAD_REQUEST
      );
    }
  }

  async checkUniqueName(doctorId, name) {
    const exists = await this.clinicModel.findOne({
      doctorId,
      name,
      isDeleted: false
    });

    if (exists) {
      throw new CustomError(
        "Clinic with same name already exists",
        constants.RESPONSE_BAD_REQUEST
      );
    }
  }


}




export const  generateScheduleKey=(weeklySchedule)=> {
  return weeklySchedule
    .map(s => ({
      day: s.day,
      start: s.startTime,
      end: s.endTime,
      cross: s.crossMidnight ? 1 : 0
    }))
    .sort((a, b) => a.day.localeCompare(b.day))
    .map(s => `${s.day}-${s.start}-${s.end}-${s.cross}`)
    .join("|");
}



export const createClinic = async (data, doctorId, scheduleKey) => {
  try {
    const { name, address, contactNumber, fees, weeklySchedule, status } = data;

    const clinicData = {
      clinicId:generateUserId("Clinic"),
      doctorId,
      name,
      address,
      contactNumber,
      fees,
      weeklySchedule,
      status,
      scheduleKey
    };

    const newClinic = await clinicModel.create(clinicData);

    return { success: true, clinic: newClinic };
  } catch (error) {
    // Check for duplicate scheduleKey
    if (error.code === 11000 && error.keyPattern && error.keyPattern.scheduleKey) {
      return { success: false, type: "duplicate" };
    }

    // Any other error
    return { success: false, type: "other", error };
  }
};
