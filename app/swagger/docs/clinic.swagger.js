/**
 * @swagger
 * tags:
 *   name: Clinic
 *   description: Clinics endpoints
 */

/**
 * @swagger
 * /clinics/add-clinic:
 *   post:
 *     summary: Add a new clinic
 *     tags: [Clinic]
 *     security:
 *       - BedoAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - contactNumber
 *               - fees
 *               - weeklySchedule
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the clinic
 *                 example: Downtown Health Clinic
 *               address:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     example: Cairo
 *                   street:
 *                     type: string
 *                     example: Tahrir Street
 *                   building:
 *                     type: string
 *                     example: Building 12
 *                   floor:
 *                     type: string
 *                     example: 3
 *               contactNumber:
 *                 type: string
 *                 description: Contact number of the clinic
 *                 example: "01090524452"
 *               fees:
 *                 type: object
 *                 properties:
 *                   currency:
 *                     type: string
 *                     enum: ["$", "€", "£", "¥","egp"]
 *                     default: "egp"
 *                     example: "egp"
 *                   amount:
 *                     type: number
 *                     description: Consultation fee amount
 *                     example: 500
 *               weeklySchedule:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: string
 *                       enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
 *                       example: Monday
 *                     startTime:
 *                       type: string
 *                       description: Start time in HH:mm format
 *                       example: "09:00"
 *                     endTime:
 *                       type: string
 *                       description: End time in HH:mm format
 *                       example: "17:00"
 *               status:
 *                 type: string
 *                 enum: ["active", "inactive", "closed"]
 *                 default: "inactive"
 *                 example: "active"
 *     responses:
 *       201:
 *         description: Clinic added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clinic added successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Downtown Health Clinic
 *                     address:
 *                       type: object
 *                       properties:
 *                         city:
 *                           type: string
 *                           example: Cairo
 *                         street:
 *                           type: string
 *                           example: Tahrir Street
 *                         building:
 *                           type: string
 *                           example: Building 12
 *                         floor:
 *                           type: string
 *                           example: 3
 *                     contactNumber:
 *                       type: string
 *                       example: "01090524452"
 *                     fees:
 *                       type: object
 *                       properties:
 *                         currency:
 *                           type: string
 *                           example: "egp"
 *                         amount:
 *                           type: number
 *                           example: 500
 *                     weeklySchedule:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           day:
 *                             type: string
 *                             example: Monday
 *                           startTime:
 *                             type: string
 *                             example: "09:00"
 *                           endTime:
 *                             type: string
 *                             example: "17:00"
 *                     status:
 *                       type: string
 *                       example: active
 *       400:
 *         description: Bad request
 *       409:
 *         description: Conflict - A clinic with the same schedule already exists
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /clinic/doctor-clinics:
 *   get:
 *     summary: Get clinics of the logged-in doctor
 *     description: Fetch all clinics that belong to the authenticated doctor
 *     tags: [Clinic]
 *     security:
 *       - BedoAuth: []
 *     responses:
 *       200:
 *         description: Clinics fetched successfully
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
 *                   example: Clinics fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       clinicId:
 *                         type: string
 *                         example: Clinic1566da25-effe-4c37-9827-16d70c3e2ed9
 *                       doctorId:
 *                         type: string
 *                         example: Doctor60e5af33-1e69-462c-9629-6511cd951bba
 *                       name:
 *                         type: string
 *                         example: Ciro Clinic
 *                       contactNumber:
 *                         type: string
 *                         example: "01090524452"
 *                       status:
 *                         type: string
 *                         enum: [active, inactive, closed]
 *                         example: active
 *                       address:
 *                         type: object
 *                         properties:
 *                           city:
 *                             type: string
 *                             example: Cairo
 *                           street:
 *                             type: string
 *                             example: October
 *                           building:
 *                             type: string
 *                             example: "10"
 *                           floor:
 *                             type: string
 *                             example: "3"
 *                       fees:
 *                         type: object
 *                         properties:
 *                           currency:
 *                             type: string
 *                             example: egp
 *                           amount:
 *                             type: number
 *                             example: 500
 *                       weeklySchedule:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             day:
 *                               type: string
 *                               enum:
 *                                 - Sunday
 *                                 - Monday
 *                                 - Tuesday
 *                                 - Wednesday
 *                                 - Thursday
 *                                 - Friday
 *                                 - Saturday
 *                               example: Sunday
 *                             startTime:
 *                               type: string
 *                               example: "15:00"
 *                             endTime:
 *                               type: string
 *                               example: "20:00"
 *                             crossMidnight:
 *                               type: boolean
 *                               example: false
 *                             _id:
 *                               type: string
 *                               example: 6972383a7e89c010044525be
 *                       scheduleKey:
 *                         type: string
 *                         example: Sunday-15:00-20:00-0|Wednesday-15:00-20:00-0
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-01-22T14:46:18.055Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-01-22T14:46:18.055Z
 *                 errors:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 stack:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Unauthorized - Doctor not logged in or invalid token
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /clinic/{clinicId}:
 *   get:
 *     summary: Get clinic details by clinic ID
 *     description: Fetch a single clinic that belongs to the authenticated doctor
 *     tags: [Clinic]
 *     security:
 *       - BedoAuth: []
 *     parameters:
 *       - in: path
 *         name: clinicId
 *         required: true
 *         description: Unique clinic ID
 *         schema:
 *           type: string
 *           example: Clinic1566da25-effe-4c37-9827-16d70c3e2ed9
 *     responses:
 *       200:
 *         description: Clinic data fetched successfully
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     clinicId:
 *                       type: string
 *                     doctorId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     contactNumber:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [active, inactive, closed]
 *                     address:
 *                       type: object
 *                       properties:
 *                         city:
 *                           type: string
 *                         street:
 *                           type: string
 *                         building:
 *                           type: string
 *                         floor:
 *                           type: string
 *                     fees:
 *                       type: object
 *                       properties:
 *                         currency:
 *                           type: string
 *                         amount:
 *                           type: number
 *                     weeklySchedule:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           day:
 *                             type: string
 *                           startTime:
 *                             type: string
 *                           endTime:
 *                             type: string
 *                           crossMidnight:
 *                             type: boolean
 *                     scheduleKey:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 errors:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 stack:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Unauthorized - Doctor not logged in
 *       404:
 *         description: Clinic not found or does not belong to this doctor
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /clinic/clinic-information/{clinicId}:
 *   get:
 *     summary: Get clinic availability
 *     description: Retrieve clinic availability and schedule by clinic ID
 *     tags: [Clinic]
 *     parameters:
 *       - in: path
 *         name: clinicId
 *         required: true
 *         description: Unique clinic ID
 *         schema:
 *           type: string
 *           example: Clinic1566da25-effe-4c37-9827-16d70c3e2ed9
 *     responses:
 *       200:
 *         description: Clinic availability retrieved successfully
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
 *                   example: Clinic availability retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     clinicId:
 *                       type: string
 *                       example: Clinic1566da25-effe-4c37-9827-16d70c3e2ed9
 *                     doctorId:
 *                       type: string
 *                       example: Doctor60e5af33-1e69-462c-9629-6511cd951bba
 *                     name:
 *                       type: string
 *                       example: Ciro Clinic
 *                     contactNumber:
 *                       type: string
 *                       example: "01090524452"
 *                     status:
 *                       type: string
 *                       enum: [active, inactive, closed]
 *                       example: active
 *                     address:
 *                       type: object
 *                       properties:
 *                         city:
 *                           type: string
 *                           example: Cairo
 *                         street:
 *                           type: string
 *                           example: October
 *                         building:
 *                           type: string
 *                           example: "10"
 *                         floor:
 *                           type: string
 *                           example: "3"
 *                     fees:
 *                       type: object
 *                       properties:
 *                         currency:
 *                           type: string
 *                           example: egp
 *                         amount:
 *                           type: number
 *                           example: 500
 *                     weeklySchedule:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           day:
 *                             type: string
 *                             enum:
 *                               - Sunday
 *                               - Monday
 *                               - Tuesday
 *                               - Wednesday
 *                               - Thursday
 *                               - Friday
 *                               - Saturday
 *                             example: Sunday
 *                           startTime:
 *                             type: string
 *                             example: "15:00"
 *                           endTime:
 *                             type: string
 *                             example: "20:00"
 *                           crossMidnight:
 *                             type: boolean
 *                             example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-01-22T14:46:18.055Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-01-22T14:46:18.055Z
 *                 errors:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *                 stack:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: Clinic not found
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /clinic/doctor/update-clinic/{clinicId}:
 *   put:
 *     summary: Update clinic information
 *     description: Doctor can update clinic info including name, contactNumber, status, address, fees, and weeklySchedule.
 *     tags: [Clinic]
 *     security:
 *       - BedoAuth: []
 *     parameters:
 *       - in: path
 *         name: clinicId
 *         required: true
 *         description: Clinic unique ID
 *         schema:
 *           type: string
 *           example: Clinic1566da25-effe-4c37-9827-16d70c3e2ed9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Downtown Health Clinic
 *               contactNumber:
 *                 type: string
 *                 example: "01090524452"
 *               status:
 *                 type: string
 *                 enum: [active, inactive, closed]
 *                 example: active
 *               address:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     example: Cairo
 *                   street:
 *                     type: string
 *                     example: October
 *                   building:
 *                     type: string
 *                     example: "10"
 *                   floor:
 *                     type: string
 *                     example: "3"
 *               fees:
 *                 type: object
 *                 properties:
 *                   currency:
 *                     type: string
 *                     example: egp
 *                   amount:
 *                     type: number
 *                     example: 500
 *               weeklySchedule:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Schedule item ID
 *                     day:
 *                       type: string
 *                       enum: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
 *                     startTime:
 *                       type: string
 *                       example: "15:00"
 *                     endTime:
 *                       type: string
 *                       example: "20:00"
 *                     crossMidnight:
 *                       type: boolean
 *                       example: false
 *     responses:
 *       200:
 *         description: Clinic updated successfully
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
 *                   example: Clinic updated successfully
 *       400:
 *         description: Bad request / Clinic not found
 *       401:
 *         description: Unauthorized - Doctor not logged in
 *       500:
 *         description: Internal server error
 */
