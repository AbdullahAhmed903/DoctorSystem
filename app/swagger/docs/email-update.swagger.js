
/**
 * @swagger
 * tags:
 *   name: emailUpdate
 *   description: Email endpoints
 */

/**
 * @swagger
 * /update-email-request:
 *   post:
 *     summary: Request email update (send verification codes)
 *     description: |
 *       Sends verification codes to both the old email and the new email.
 *       The email must not already exist for any doctor or patient.
 *
 *       Authentication required:
 *       - User must be logged in.
 *       - JWT access token must be sent in the Authorization header as:
 *         `Authorization: Bearer <token>`
 *     tags: [emailUpdate]
 *     security:
 *       - BedoAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newEmail
 *             properties:
 *               newEmail:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *     responses:
 *       200:
 *         description: Verification codes sent successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Verification codes sent to both old and new email addresses
 *       400:
 *         description: Validation or business error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: This email is already used. Choose another one.
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /update-email:
 *   patch:
 *     summary: Confirm email update
 *     description: |
 *       Verifies the OTP codes sent to the old and new email addresses.
 *       If valid and not expired, the user's email will be updated.
 *       Code will expire after 5 Minutes
 * 
 *        Authentication required:
 *       - User must be logged in.
 *       - JWT access token must be sent in the Authorization header as:
 *         `Authorization: Bearer <token>`
 *     tags: [emailUpdate]
 *     security:
 *       - BedoAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldEmailCode
 *               - newEmailCode
 *             properties:
 *               oldEmailCode:
 *                 type: string
 *                 example: "123456"
 *               newEmailCode:
 *                 type: string
 *                 example: "654321"
 *     responses:
 *       200:
 *         description: Email updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Email updated successfully
 *       400:
 *         description: Invalid or expired codes
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: Invalid verification codes
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No email update request found
 *       500:
 *         description: Internal server error
 */
