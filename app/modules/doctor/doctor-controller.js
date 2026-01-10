import sharp from "sharp";
import logger from "../../../config/logger.js";
import redisClient from "../../../config/redis.js";
import imagekitUploding from "../../utils/image-kit.js";
import { constants, sendResponse } from "../../utils/utills-service.js";
// import tokenSchema from "../auth/token-schema.js";
import Doctor from "../../DB/models/doctor-schema.js";








const getDoctorProfile = async (req, res) => {
  try {
    const { doctorId } = req.user;
    const cacheKey = `doctor:${doctorId}`; // unique cache key

    // 1️⃣ Check if data is already in Redis
    const cachedProfile = await redisClient.get(cacheKey);
    if (cachedProfile) {
      logger.info(`📦 Profile served from cache for doctorId: ${doctorId}`);
      return sendResponse(
        res,
        constants.RESPONSE_SUCCESS,
        "Doctor profile fetched successfully (from cache)",
        cachedProfile
      );
    }
        
    // 2️⃣ Fetch from MongoDB if not cached
    const doctorProfile = await Doctor.findOne({ doctorId })
      .select("-_id -__v -password -isEmailVerified -isDeleted")
      .lean();

    if (!doctorProfile) {
      return sendResponse(res, constants.RESPONSE_NOT_FOUND, "Doctor profile not found");
    }

    // 3️⃣ Store result in Redis for 10 minutes (600 seconds)
    await redisClient.set(cacheKey,JSON.stringify(doctorProfile),{ex:600});

    logger.info(`💾 Profile cached for doctorId: ${doctorId}`);
    return sendResponse(res, constants.RESPONSE_SUCCESS, "Doctor profile fetched successfully", doctorProfile);
  } catch (error) {
    logger.error(`Error in getDoctorProfile: ${error.message}`);
    return sendResponse(res, constants.RESPONSE_INT_SERVER_ERROR, error.message, {}, constants.UNHANDLED_ERROR);
  }
};



const updateprofile = async (req, res) => {
  try {
  const { doctorId } = req.user;
  const updateData = req.body;
        const { image, files: certFiles } = req.files || {};
    
  // If there's a file uploaded, add its buffer and mimetype to updateData
  if (image?.length > 0) {
    const compressedBuffer = await sharp(image[0].buffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toBuffer();
      const uploadedImg = await imagekitUploding.upload({
        file: compressedBuffer,
        fileName: image[0].originalname,
        folder: `doctor_${doctorId}_profile_image`,
        useUniqueFileName: true,
      });

      updateData.profileImage = uploadedImg.url;
    }

  if (certFiles?.length > 0) {
      const uploadPromises = certFiles.map((file) =>

        imagekitUploding.upload({
          file: file.buffer,
          fileName: file.originalname,
          folder: `doctor_${doctorId}_certifications`,
          useUniqueFileName: true,
        })
      );
      const uploadedCertificates = await Promise.all(uploadPromises);
      updateData.certifications = uploadedCertificates.map((item) => item.url);
    }

  const updatedDoctor = await Doctor.findOneAndUpdate(
    { doctorId },
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-_id -__v -password -isEmailVerified -isDeleted").lean();
  if (!updatedDoctor) {
    return sendResponse(res, constants.RESPONSE_NOT_FOUND, "Doctor profile not found");
  }

  // Invalidate the Redis cache for this doctor's profile
  const cacheKey = `doctor:${doctorId}`;
  await redisClient.del(cacheKey);
  logger.info(`🗑️ Cache invalidated for doctorId: ${doctorId} after profile update`);
  return sendResponse(res, constants.RESPONSE_SUCCESS, "Doctor profile updated successfully", updatedDoctor);
  } catch (error) {
        logger.error(`Error in getDoctorProfile: ${error.message}`);
    return sendResponse(res, constants.RESPONSE_INT_SERVER_ERROR, error.message, {}, constants.UNHANDLED_ERROR);
  }

}



const deleteProfile = async (req, res) => {
  try {
    const { doctorId } = req.user;
    const deletedDoctor = await Doctor.findOneAndUpdate(
      { doctorId,isDeleted:false },
      { isDeleted: true },
      { new: true }
    ).select("-_id -__v -password -isEmailVerified -isDeleted").lean();
    if (!deletedDoctor) {
      return sendResponse(res, constants.RESPONSE_NOT_FOUND, "Doctor profile not found");
    }
    // Invalidate the Redis cache for this doctor's profile
    const cacheKey = `doctor:${doctorId}`;
    await redisClient.del(cacheKey);
    // await tokenSchema.deleteMany({ doctorId }).lean();
    logger.info(`🗑️ Cache invalidated for doctorId: ${doctorId} after profile deletion`);
    return sendResponse(res, constants.RESPONSE_SUCCESS, "Doctor profile deleted successfully");
  }
    catch (error) {
      logger.error(`Error in deleteProfile: ${error.message}`);
      return sendResponse(res, constants.RESPONSE_INT_SERVER_ERROR, error.message, {}, constants.UNHANDLED_ERROR);
    }
};






export {
  getDoctorProfile,
  updateprofile,
  deleteProfile
};