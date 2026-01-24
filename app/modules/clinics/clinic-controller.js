import logger from "../../../config/logger.js";
import redisClient from "../../../config/redis.js";
import clinicModel from "../../DB/models/clinic-schema.js";
import { asyncHandler, CustomError } from "../../middlewares/error-handling.js";
import { sendResponse, constants, randomNumber, CacheService } from "../../utils/utills-service.js";
import { checkRequiredFields, ClinicPolicy, createClinic, generateScheduleKey } from "./clinicServices/add-clinic-service.js";
import { checkExistingClinic, UpdateFields } from "./clinicServices/update-clinic-service.js";

    const casheService=new CacheService(redisClient)

const addClinic =asyncHandler( async (req, res) => {
        const {doctorId}=req.user   
        
        checkRequiredFields(req.body)

       const clinicPolicy = new ClinicPolicy(clinicModel);

        await clinicPolicy.checkClinicLimit(doctorId);
        await clinicPolicy.checkUniqueName(doctorId, req.body.name);
        const scheduleKey =generateScheduleKey(req.body.weeklySchedule);

        const result=await createClinic(req.body,doctorId,scheduleKey)
        if (!result.success) {
            if (result.type === "duplicate") {
                throw new CustomError("A clinic with the same schedule already exists",constants.RESPONSE_CONFLICT)
            }
            logger.error("Failed to create clinic:", result.error);
                throw new CustomError("Failed to create clinic",constants.RESPONSE_BAD_REQUEST)

            }
        const cacheKey=casheService.buildKey("doctorClinics",doctorId)
        try {
            await casheService.deleteCache(cacheKey);
            logger.info(`Cleared cache for ${cacheKey} after adding clinic`);
        } catch (redisErr) {
            logger.warn("Failed to clear clinics cache:", redisErr);
        }

        return sendResponse(res, constants.RESPONSE_CREATED, "Clinic added successfully", result.clinic);
}
)



const getDoctorClinics=asyncHandler(async(req,res)=>{
        const {doctorId}=req.user;

        const cacheKey=casheService.buildKey("doctorClinics",doctorId)
        
        const cachedDoctorClinics =await casheService.getCache(cacheKey)
        
        if (cachedDoctorClinics) {
            logger.info(`📦 Clinics served from cache for doctorId: ${doctorId}`);
            return sendResponse(
            res,
            constants.RESPONSE_SUCCESS,
            "Doctor Clinics fetched successfully (from cache)",
            cachedDoctorClinics
            );
        }
        console.log("gggggggg");
        
        const clinics=await clinicModel.find({doctorId:doctorId}).select("-_id -__v -isDeleted")
        casheService.setCache(cacheKey,clinics,600)
        
        sendResponse(res,constants.RESPONSE_SUCCESS,"Clinics fetched successfully",clinics)
})


const getOneClinicById=asyncHandler(async(req,res)=>{
    const {clinicId}=req.params;
    const {doctorId}=req.user

    const checkClinic=await checkExistingClinic({clinicId,doctorId})

    sendResponse(res,constants.RESPONSE_SUCCESS,"Clinic Data :",checkClinic)
})


const updateClinicInfo=asyncHandler(async(req,res)=>{
        const {clinicId}=req.params;
        const {doctorId}=req.user
        const body=req.body
        await checkExistingClinic({clinicId,doctorId})

        const clinic=new UpdateFields(clinicModel,body)
        clinic.updateNormalObject(clinicId,doctorId)
        clinic.updateArrayFields(clinicId,doctorId)  

        return sendResponse(
            res,
            constants.RESPONSE_SUCCESS,
            "Clinic updated successfully"
        );
        
})



const getClinicAvailability=asyncHandler(async(req,res)=>{
    const {clinicId}=req.params;
    const cacheKey=casheService.buildKey("clinicAvailability",clinicId)
    const cacheclinicAvailability=await casheService.getCache(cacheKey)
    if (cacheclinicAvailability) {
            logger.info(`📦 Clinics served from cache for clinicId: ${clinicId}`);
            return sendResponse(
            res,
            constants.RESPONSE_SUCCESS,
            "Clinics Availability fetched successfully (from cache)",
            cacheclinicAvailability
            );
        }
    const clinic=await clinicModel.findOne({clinicId,isDeleted:false}).select("-_id -scheduleKey -__v -isDeleted ")
    await casheService.setCache(cacheKey,clinic,600)
      if (!clinic) {
    return sendResponse(res, constants.RESPONSE_NOT_FOUND, "Clinic not found");
  }

  return sendResponse(
    res,
    constants.RESPONSE_SUCCESS,
    "Clinic availability retrieved successfully",
    clinic
  );
    
})





export { 
    addClinic,
    getDoctorClinics,
    getOneClinicById,
    updateClinicInfo,
    getClinicAvailability,
};
