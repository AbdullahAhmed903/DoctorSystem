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


/**
 * @swagger
 * /doctor/delete-profile:
 *   delete:
 *     summary: Delete doctor profile
 *     description: |
 *       Soft deletes the authenticated doctor's profile by setting isDeleted to true.
 *       
 *       🔐 Authentication required:
 *       - User must be logged in
 *       - JWT access token must be sent in the Authorization header as:
 *         Authorization: Bearer <token>
 *       
 *       This action invalidates the cached doctor profile in Redis to maintain cache consistency.
 *       
 *       ⚠️ This endpoint is idempotent:
 *       - If the profile is already deleted, the system will return "Doctor profile not found".
 *       
 *       🔒 This endpoint is rate-limited to prevent abuse.
 *     tags:
 *       - Doctor
 *     security:
 *       - BedoAuth: []
 *     responses:
 *       200:
 *         description: Doctor profile deleted successfully
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       403:
 *         description: Forbidden – access restricted to doctors only
 *       404:
 *         description: Doctor profile not found or already deleted
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /doctor/update-profile:
 *   put:
 *     summary: Update doctor profile
 *     tags: [Doctor]
 *     security:
 *       - BedoAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 example: Abdullah Ahmed
 *
 *               specialization:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: Cardiology
 *
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 example: Male
 *
 *               age:
 *                 type: number
 *                 minimum: 20
 *                 maximum: 80
 *                 example: 35
 *
 *               phone:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 3
 *                 items:
 *                   type: string
 *                   pattern: "^[0-9]{10,15}$"
 *                 example: ["01090524452", "01226362869"]
 *
 *               address:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - address
 *                     - city
 *                     - state
 *                     - country
 *                     - postalCode
 *                   properties:
 *                     address:
 *                       type: string
 *                       maxLength: 100
 *                       example: 12 Street Name
 *                     city:
 *                       type: string
 *                       maxLength: 50
 *                       example: Cairo
 *                     state:
 *                       type: string
 *                       maxLength: 50
 *                       example: Nasr City
 *                     country:
 *                       type: string
 *                       maxLength: 50
 *                       example: Egypt
 *                     postalCode:
 *                       type: string
 *                       maxLength: 20
 *                       example: 11765
 *
 *               education:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     degree:
 *                       type: string
 *                       example: MBBS
 *                     institution:
 *                       type: string
 *                       example: Cairo University
 *                     year:
 *                       type: number
 *                       example: 2018
 *
 *               experience:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - title
 *                     - hospital
 *                     - from
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: Senior Cardiologist
 *                     hospital:
 *                       type: string
 *                       example: Al Salam Hospital
 *                     from:
 *                       type: string
 *                       format: date
 *                       example: 2020-01-01
 *                     to:
 *                       type: string
 *                       format: date
 *                       example: 2023-12-31
 *
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 example:
 *                   - https://example.com/cert1.pdf
 *
 *               about:
 *                 type: string
 *                 maxLength: 1000
 *                 example: Experienced cardiologist with 10+ years of practice
 *
 *               profilePicture:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/profile.png
 *
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
