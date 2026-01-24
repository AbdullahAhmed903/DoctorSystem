import Doctor from "../../../DB/models/doctor-schema.js";
import patientModel from "../../../DB/models/patient-schema.js";
import { CustomError } from "../../../middlewares/error-handling.js";
import { constants } from "../../../utils/utills-service.js";




const isEmailUsed = async (email, exclude = {}) => {
  const [doctor, patient] = await Promise.all([
    Doctor.findOne({
      email,
      ...(exclude.doctor || {})
    }).lean(),
    patientModel.findOne({
      email,
      ...(exclude.patient || {})
    }).lean()
  ]);

  return !!(doctor || patient);
};


const requestEmailService = {
  doctor: async ({ doctorId, newEmail }) => {
    const emailUsed = await isEmailUsed(newEmail, {doctor: { doctorId: { $ne: doctorId } }});
    if (emailUsed) {
      return { exist: true, message: "This email is already used. Choose another one." };
    }
    const doctor = await Doctor.findOne({ doctorId }).lean();
    if (!doctor) {
      return { exist: true, message: "Doctor not found" };
    }
    return {
      userId: doctor.doctorId,
      name: doctor.name,
      email: doctor.email
    };
  },

  patient: async ({ patientId, newEmail }) => {
    const emailUsed = await isEmailUsed(newEmail, {patient: { patientId: { $ne: patientId } }});
    if (emailUsed) {
      return { exist: true, message: "This email is already used. Choose another one." };
    }
    const patient = await patientModel.findOne({ patientId }).lean();
    if (!patient) {
      return { exist: true, message: "Patient not found" };
    }
    return {
      userId: patient.patientId,
      name: patient.name,
      email: patient.email
    };
  }
};

export const checkUserType = async (user, newEmail) => {
  const userType = user.TO;

  if (!requestEmailService[userType]) {
    throw new CustomError("Invalid user type",constants.RESPONSE_NOT_FOUND);
  }

  return requestEmailService[userType]({
    ...user,
    newEmail
  });
};