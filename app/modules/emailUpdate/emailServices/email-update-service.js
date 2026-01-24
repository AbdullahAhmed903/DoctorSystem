import redisClient from "../../../../config/redis.js";
import Doctor from "../../../DB/models/doctor-schema.js";
import EmailUpdate from "../../../DB/models/emailUpdate-schema.js";
import patientModel from "../../../DB/models/patient-schema.js";
import { CustomError } from "../../../middlewares/error-handling.js";
import { CacheService, constants } from "../../../utils/utills-service.js";

const cacheService=new CacheService(redisClient)


const DoctorRepository = {
  findById: (doctorId) =>
    Doctor.findOne({ doctorId }).lean(),

  updateEmail: (doctorId, email) =>
    Doctor.findOneAndUpdate({ doctorId }, { email })
};



const PatientRepository = {
  findById: (patientId) =>
    patientModel.findOne({ patientId }).lean(),

  updateEmail: (patientId, email) =>
    patientModel.findOneAndUpdate({ patientId }, { email })
};


const EmailUpdateRepository = {
  findByUserId: (userId) =>
    EmailUpdate.findOne({ userId }).lean(),

  deleteByUserId: (userId) =>
    EmailUpdate.deleteOne({ userId })
};




const UserEmailStrategy = {
  doctor: {
    getId: (user) => user.doctorId,
    updateEmail: async (userId, email) => {
      await DoctorRepository.updateEmail(userId, email);
      const cacheKey=cacheService.buildKey("doctor",userId)
      await cacheService.deleteCache(cacheKey)
    }
  },

  patient: {
    getId: (user) => user.patientId,
    updateEmail: async (userId, email) => {
      await PatientRepository.updateEmail(userId, email);
      const cacheKey=cacheService.buildKey("patient",userId)
      await cacheService.deleteCache(cacheKey)
    }
  }
};







export const updateUserEmail = async ({
  user,
  oldEmailCode,
  newEmailCode
}) => {
  const strategy = UserEmailStrategy[user.TO];
  if (!strategy) throw new CustomError("Invalid user role",constants.RESPONSE_NOT_FOUND);

  const userId = strategy.getId(user);
  console.log(userId);
  

  const request = await EmailUpdateRepository.findByUserId(userId);
  if (!request) throw new CustomError("No email update request found",constants.RESPONSE_NOT_FOUND);

  if (request.expiresAt < Date.now()) {
    await EmailUpdateRepository.deleteByUserId(userId);
    throw new CustomError("Verification codes have expired",constants.RESPONSE_NOT_FOUND);
  }

  if (
    String(request.oldEmailCode) !== String(oldEmailCode) ||
    String(request.newEmailCode) !== String(newEmailCode)
  ) {
    throw new Error("Invalid verification codes");
  }

  await strategy.updateEmail(userId, request.newEmail);
  await EmailUpdateRepository.deleteByUserId(userId);
};