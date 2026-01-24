/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/patient/signup:
 *   post:
 *     summary: Register a new patient
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - gender
 *               - phone
 *               - age
 *             properties:
 *               name:
 *                 type: string
 *                 example: Abdullah
 *               email:
 *                 type: string
 *                 example: test@email.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               gender:
 *                 type: string
 *                 example: Male
 *               phone:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "01090524452"
 *               age:
 *                 type: integer
 *                 example: 30
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *       400:
 *         description: Bad request / Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/doctor/signup:
 *   post:
 *     summary: Register a new doctor
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - gender
 *               - phone
 *               - specialization
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dr. John Doe
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               gender:
 *                 type: string
 *                 example: Male
 *               phone:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "01090524452"
 *               specialization:
 *                 type: string
 *                 example: Cardiology
 *               age:
 *                 type: integer
 *                 example: 45
 *     responses:
 *       201:
 *         description: Doctor registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *       400:
 *         description: Bad request / Validation error
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/doctor/login:
 *   post:
 *     summary: Login for doctors
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful (JWT returned in body and stored in HttpOnly cookie)
 *         headers:
 *           Set-Cookie:
 *             description: JWT token stored in HttpOnly cookie
 *             schema:
 *               type: string
 *               example: token=eyJhbGciOiJIUzI1Ni...; HttpOnly; Path=/; Max-Age=3600
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login succeed
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     doctor:
 *                       type: object
 *                       example:
 *                         id: 64fabc123
 *                         name: Dr. John
 *                         email: test@gmail.com
 *       400:
 *         description: Bad request / Validation error
 *       401:
 *         description: Unauthorized / Invalid credentials
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/patient/login:
 *   post:
 *     summary: Login for patients
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: abdullahahmed02000@gmail.com
 *               password:
 *                 type: string
 *                 example: 123456789
 *     responses:
 *       200:
 *         description: Login successful (JWT returned in body and stored in HttpOnly cookie)
 *         headers:
 *           Set-Cookie:
 *             description: JWT token stored in HttpOnly cookie
 *             schema:
 *               type: string
 *               example: token=eyJhbGciOiJIUzI1Ni...; HttpOnly; Path=/; Max-Age=3600
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login succeed
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     doctor:
 *                       type: object
 *                       example:
 *                         id: 64fabc123
 *                         name: Dr. John
 *                         email: test@gmail.com
 *       400:
 *         description: Bad request / Validation error
 *       401:
 *         description: Unauthorized / Invalid credentials
 *       500:
 *         description: Internal server error
 */

/** 
 * @swagger
 * /auth/forget-password:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - userType
 *             properties:
 *               identifier:
 *                 type: string
 *                 example: phone number or email
 *               userType:
 *                 type: string
 *                 example: doctor or patient
 *     responses:
 *       200:
 *         description: OTP sent to email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                  type: string
 *                  example: code sent to email
 *       400:
 *         description: Bad request / Validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - newpassword
 *               - repetedNewPassword
 *               - identifier
 *               - userType
 *             properties:
 *               code:
 *                 type: string
 *                 example: OTP code received via email
 *               newpassword:
 *                 type: string
 *                 example: newpassword123
 *               repetedNewPassword:
 *                 type: string
 *                 example: newpassword123
 *               identifier:
 *                 type: string
 *                 example: phone number or email
 *               userType:
 *                 type: string
 *                 example: doctor or patient
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Bad request / Validation error / Invalid verification code / Verification code expired
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New Access Token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: New Access Token
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: No Refresh Token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out the authenticated user by clearing the refresh token cookie.
 *     tags:
 *       - Auth
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
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
 *                   example: Logged out successfully
 *       401:
 *         description: Unauthorized – user is not authenticated
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /auth/verifyEmail/{token}:
 *   get:
 *     summary: Verify user email
 *     description: |
 *       Verifies user email using a JWT token sent to the user's email.
 *       Supports both Doctor and Patient roles.
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification JWT token
 *     responses:
 *       200:
 *         description: Email verified successfully
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
 *                   example: Email verified successfully
 *       400:
 *         description: Invalid or tampered token / invalid payload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid or tampered token
 *       401:
 *         description: Token expired
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Token expired. Please re-register.
 *       404:
 *         description: User not found or email already verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found or already verified
 *       500:
 *         description: Internal server error
 */

