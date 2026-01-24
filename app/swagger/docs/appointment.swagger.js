


/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: Appointment endpoints
 */


/**
 * @swagger
 * /appointment/doctor/cancel-appointment/{clinicId}:
 *   post:
 *     summary: Cancel appointments for a specific clinic schedule
 *     description: |
 *       Cancels all appointments for a given clinic on a specific date.
 *       Patients will be notified via email asynchronously using a background queue (BullMQ).
 *     tags: [Appointment]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cancelDate
 *             properties:
 *               cancelDate:
 *                 type: string
 *                 format: date
 *                 description: Date for which all appointments will be cancelled
 *                 example: 2026-02-01
 *     responses:
 *       200:
 *         description: Schedule cancelled successfully and patients notified
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
 *                   example: Schedule cancelled and patients will be notified.
 *                 data:
 *                   nullable: true
 *                   example: null
 *                 errors:
 *                   nullable: true
 *                   example: null
 *                 stack:
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Invalid date or missing cancelDate
 *       401:
 *         description: Unauthorized - Doctor not logged in
 *       404:
 *         description: No appointments found for the given date
 *         content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: There is no appointment on this date   
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /appointment/patient/book-appointment/{clinicId}:
 *   post:
 *     summary: Book an appointment at a specific clinic
 *     description: |
 *       Allows a patient to book an appointment with a doctor at a specified clinic.
 *     tags: [Appointment]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - date
 *               - startTime
 *               - endTime
 *             properties:
 *               doctorId:
 *                 type: string
 *                 description: Unique doctor ID
 *                 example: Doctor60e5af33-1e69-462c-9629-6511cd951bba
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Appointment date in YYYY-MM-DD format
 *                 example: 2026-03-15
 *               startTime:
 *                 type: string
 *                 description: Appointment start time in HH:MM format (24-hour)
 *                 example: "15:30"
 *               endTime:
 *                 type: string
 *                 description: Appointment end time in HH:MM format (24-hour)
 *                 example: "16:00"
 *               typeOfPayment:
 *                 type: string
 *                 description: Payment method for the appointment
 *                 enum: [cash, credit_card, insurance, online_payment]
 *                 example: cash
 *               reasonForVisit:
 *                 type: string
 *                 description: Reason for the appointment
 *                 example: Regular check-up
 *               notes:
 *                 type: string
 *                 description: Additional notes for the appointment
 *                 example: Please bring previous medical records.
 *     responses:
 *       201:
 *         description: Appointment booked successfully
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
 *                   example: Appointment booked successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     savedAppointment:
 *                       type: object
 *                       description: Details of the booked appointment
 *                     session:
 *                       type: string
 *                       description: Payment session URL (if applicable)
 *                 errors:
 *                   nullable: true
 *                   example: null
 *                 stack:
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Patient not logged in
 *       404:
 *         description: Doctor or clinic not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /appointment/doctor/appointments:
 *   get:
 *     summary: Get appointments for the logged-in doctor
 *     tags: [Appointment]
 *     security:
 *       - BedoAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Doctor appointments fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "doctor Appointments"
 *               data:
 *                 - appointmentId: "appointmentecfc4cb6-afa5-4a89-8864-41bb9769c7c1"
 *                   doctorId: "Doctor60e5af33-1e69-462c-9629-6511cd951bba"
 *                   patientId: "Patient36841b0a-387b-4a38-9855-f81bfa479ac8"
 *                   clinicId: "Clinic8dc7c8ba-2dba-4d30-8fde-6c7ab53011dd"
 *                   startTime: "15:00"
 *                   endTime: "15:30"
 *                   status: "cancelled"
 *                   user:
 *                     name: "Abdullah Ahmed"
 *                     email: "test1@gmail.com"
 *                     gender: "Male"
 *                     phone: ["01001637706"]
 *                     userRole: "patient"
 *                   clinicName: "Downtown Health Clinic"
 *                   clinicCity: "Cairo"
 *                   clinicStreet: "October"
 *                   clinicBuilding: "10"
 *                   clinicFloor: "3"
 *                   clinicPhone: "01090524452"
 *                   clinicWeeklySchedule:
 *                     - day: "Saturday"
 *                       startTime: "15:00"
 *                       endTime: "20:00"
 *                       crossMidnight: false
 *                       _id: "697238c7d425902619fd67d0"
 *
 * /appointment/patient/appointments:
 *   get:
 *     summary: Get appointments for the logged-in patient
 *     tags: [Appointment]
 *     security:
 *       - BedoAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Patient appointments fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "patient Appointments"
 *               data:
 *                 - appointmentId: "appointment5172f428-e3b1-4a79-bcb4-f02b500d580e"
 *                   doctorId: "Doctor60e5af33-1e69-462c-9629-6511cd951bba"
 *                   patientId: "Patient63e0193b-7dba-495d-976e-bb4e31cbb5a5"
 *                   clinicId: "Clinic8dc7c8ba-2dba-4d30-8fde-6c7ab53011dd"
 *                   startTime: "15:30"
 *                   endTime: "16:00"
 *                   status: "cancelled"
 *                   user:
 *                     name: "Abdullah Ahmedd"
 *                     email: "bedo88232@gmail.com"
 *                     gender: "Male"
 *                     phone: ["01226362869","01090524452"]
 *                     specialization: "css"
 *                     experience:
 *                       - title: "doctor"
 *                         hospital: "giza"
 *                         from: "2024-01-01T00:00:00.000Z"
 *                         to: "2025-01-01T00:00:00.000Z"
 *                     userRole: "doctor"
 *                   clinicName: "Downtown Health Clinic"
 *                   clinicCity: "Cairo"
 *                   clinicStreet: "October"
 *                   clinicBuilding: "10"
 *                   clinicFloor: "3"
 *                   clinicPhone: "01090524452"
 *                   clinicWeeklySchedule:
 *                     - day: "Saturday"
 *                       startTime: "15:00"
 *                       endTime: "20:00"
 *                       crossMidnight: false
 *                       _id: "697238c7d425902619fd67d0"
 */


/**
 * @swagger
 * /appointment/doctor/update-appointment-status/{appointmentId}:
 *   patch:
 *     summary: Update the status of an appointment
 *     description: Allows a doctor to update the status of a specific appointment.
 *     tags: [Appointment]
 *     security:
 *       - BedoAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         description: Unique appointment ID
 *         schema:
 *           type: string
 *           example: appointmentecfc4cb6-afa5-4a89-8864-41bb9769c7c1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status for the appointment
 *                 enum: [pending, confirmed, cancelled, completed]
 *                 example: confirmed
 *     responses:
 *       200:
 *         description: Appointment status updated successfully
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
 *                   example: Appointment Confirmed Success
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6973e384fe7c93f7b64fde38
 *                     appointmentId:
 *                       type: string
 *                       example: appointmentecfc4cb6-afa5-4a89-8864-41bb9769c7c1
 *                     doctorId:
 *                       type: string
 *                       example: Doctor60e5af33-1e69-462c-9629-6511cd951bba
 *                     patientId:
 *                       type: string
 *                       example: Patient36841b0a-387b-4a38-9855-f81bfa479ac8
 *                     clinicId:
 *                       type: string
 *                       example: Clinic8dc7c8ba-2dba-4d30-8fde-6c7ab53011dd
 *                     date:
 *                       type: string
 *                       format: date
 *                       example: 2026-01-24
 *                     startTime:
 *                       type: string
 *                       example: 15:00
 *                     endTime:
 *                       type: string
 *                       example: 15:30
 *                     status:
 *                       type: string
 *                       example: confirmed
 *                     typeOfPayment:
 *                       type: string
 *                       example: cash
 *                     paymentStatus:
 *                       type: string
 *                       example: pending
 *                     reasonForVisit:
 *                       type: string
 *                       example: asdas
 *                     createdBy:
 *                       type: string
 *                       example: patient
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-01-23T21:09:24.779Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-01-24T15:31:42.375Z
 *                     __v:
 *                       type: integer
 *                       example: 0
 *                     fees:
 *                       type: object
 *                       properties:
 *                         amount:
 *                           type: number
 *                           example: 500
 *                         currency:
 *                           type: string
 *                           example: egp
 *                 errors:
 *                   nullable: true
 *                   example: null
 *                 stack:
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Unauthorized - Doctor not logged in
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Internal server error
 */
