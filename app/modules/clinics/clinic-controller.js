import logger from "../../../config/logger.js";
import redisClient from "../../../config/redis.js";
import clinicModel from "../../DB/models/clinic-schema.js";
import { asyncHandler, CustomError } from "../../utils/error-handling.js";
import { sendResponse, constants, randomNumber, CacheService } from "../../utils/utills-service.js";
import { v4 as uuidv4 } from 'uuid';
import { checkRequiredFields, ClinicPolicy, createClinic } from "./clinicServices/add-clinic-service.js";

    const casheService=new CacheService(redisClient)

const addClinic =asyncHandler( async (req, res) => {
        const {doctorId}=req.user   
        
        checkRequiredFields(req.body)

       const clinicPolicy = new ClinicPolicy(clinicModel);

        await clinicPolicy.checkClinicLimit(doctorId);
        await clinicPolicy.checkUniqueName(doctorId, req.body.name);

        const newClinic=await createClinic(req.body,doctorId)

        const cacheKey=casheService.buildKey("doctorClinics",doctorId)
        try {
            await casheService.deleteCache(cacheKey);
            logger.info(`Cleared cache for ${cacheKey} after adding clinic`);
        } catch (redisErr) {
            logger.warn("Failed to clear clinics cache:", redisErr);
        }

        return sendResponse(res, constants.RESPONSE_CREATED, "Clinic added successfully", newClinic);
}
)



const getDoctorClinics=asyncHandler( async(req,res)=>{
        const {doctorId}=req.user;

        const cacheKey=casheService.buildKey("doctorClinics",doctorId)
        
        const cachedDoctorClinics =await casheService.getCache(cacheKey)
        
        if (cachedDoctorClinics) {
            logger.info(`📦 Clinics served from cache for doctorId: ${doctorId}`);
            return sendResponse(
            res,
            constants.RESPONSE_SUCCESS,
            "Doctor Clinics fetched successfully (from cache)",
            JSON.parse(cachedDoctorClinics)
            );
        }
        
        const clinics=await clinicModel.find({doctorId:doctorId}).select("-_id -__v -isDeleted")
        casheService.setCache(cacheKey,clinics,600)
        
        sendResponse(res,constants.RESPONSE_SUCCESS,"Clinics fetched successfully",clinics)
})






export { 
    addClinic,
    getDoctorClinics
};
