import logger from "../../../config/logger.js";
import redisClient from "../../../config/redis.js";
import clinicModel from "../../DB/models/clinic-schema.js";
import { sendResponse, constants, randomNumber } from "../../utils/utills-service.js";
import { v4 as uuidv4 } from 'uuid';


const addClinic = async (req, res) => {
    try {
        const { name, address, contactNumber, fees, weeklySchedule } = req.body;

        if (!name || !address || !contactNumber) {
            return sendResponse(res, constants.RESPONSE_BAD_REQUEST, "Name, address, and contactNumber are required");
        }

        // Create clinic object
        const clinicData = {
            clinicId:uuidv4(),
            doctorId: req.user.doctorId,
            name,
            address,
            contactNumber,
            fee: fees || 0,
            weeklySchedule: weeklySchedule || []
        };

        // Save clinic
        const newClinic = await clinicModel.create(clinicData);

        // Invalidate doctor's clinics cache so next read is fresh
        const cacheKey = `doctorClinics:${req.user.doctorId}`;
        try {
            await redisClient.del(cacheKey);
            logger.info(`Cleared cache for ${cacheKey} after adding clinic`);
        } catch (redisErr) {
            logger.warn("Failed to clear clinics cache:", redisErr);
            // don't fail the request if cache removal fails
        }

        return sendResponse(res, constants.RESPONSE_CREATED, "Clinic added successfully", newClinic);

    } catch (error) {
        logger.error("Error adding clinic:", error);
        return sendResponse(res, constants.RESPONSE_INT_SERVER_ERROR, constants.UNHANDLED_ERROR);
    }
};



const getDoctorClinics=async(req,res)=>{
    try {
        const {doctorId}=req.user;
        console.log(doctorId);
        
         const cacheKey = `doctorClinics:${doctorId}`; // unique cache key

        const cachedDoctorClinics = await redisClient.get(cacheKey);
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
        await redisClient.setEx(cacheKey, 600, JSON.stringify(clinics));
        
        sendResponse(res,constants.RESPONSE_SUCCESS,"Clinics fetched successfully",clinics)
    } catch (error) {
         logger.error("Error getting clinic:", error);
        return sendResponse(res, constants.RESPONSE_INT_SERVER_ERROR, constants.UNHANDLED_ERROR);
    }
}




export { 
    addClinic,
    getDoctorClinics
};
