/**
 * @swagger
 * tags:
 *   name: Doctor
 *   description: Doctor endpoints
 */

/**
 * @swagger
 * /doctor/doctor-profile:
 *   get:
 *     summary: Get doctor profile
 *     tags: [Doctor]
 *     security:
 *       - BedoAuth: []
 *     responses:
 *       200:
 *         description: Doctor profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Doctor profile fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     doctorId:
 *                       type: string
 *                       example: Doctorbb3dca6a-54de-442d-93dc-3c2e0ebd9bab
 *                     name:
 *                       type: string
 *                       example: Abdullah Ahmed
 *                     email:
 *                       type: string
 *                       example: bedo88232@gmail.com
 *                     specialization:
 *                       type: string
 *                       example: it
 *                     phone:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - "01226362869"
 *                         - "01090524452"
 *                     experience:
 *                       type: number
 *                       example: 1
 *                     gender:
 *                       type: string
 *                       example: Male
 *                     availableDays:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-13T16:24:36.329Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-21T18:35:07.679Z"
 *                     certifications:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - https://ik.imagekit.io/abdullahAhmed/doctor_Doctorbb3dca6a-54de-442d-93dc-3c2e0ebd9bab_certifications/Abdullah_Ahmed_nodejs_cv__ssfm8gGVK.pdf
 *                     profileImage:
 *                       type: string
 *                       example: https://ik.imagekit.io/abdullahAhmed/doctor_Doctorbb3dca6a-54de-442d-93dc-3c2e0ebd9bab_profile_image/Screenshot_2025-02-07_213926_FcOxApuBt.png
 *                     userType:
 *                       type: string
 *                       example: doctor
 *                 errors:
 *                   type: null
 *                   example: null
 *                 stack:
 *                   type: null
 *                   example: null
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Internal server error
 */
