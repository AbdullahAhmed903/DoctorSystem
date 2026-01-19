import CONFIG from "../../../../config/config.js";

export const paymentSuccessTemplate = ({ email,name }) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 20px auto; border: 1px solid #dddddd; padding: 20px;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px; font-size: 14px;">
      <tr>
        <td style="padding-bottom: 5px;">
          <strong>From:</strong> ${CONFIG.NODEMAILER_EMAIL_FROM}
        </td>
      </tr>
      <tr>
        <td style="padding-bottom: 20px;">
          <strong>To:</strong> ${email}
        </td>
      </tr>
    </table>

    <h2 style="color: #1a73e8; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">
      ✅ Payment Successful & Appointment Confirmed
    </h2>

    <p>Dear <strong>${name}</strong>,</p>

    <p>
      We are happy to inform you that your payment has been processed successfully.
    </p>

    <p>
      🎉 <strong>Your appointment has been successfully booked.</strong>
    </p>

    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4CAF50; margin: 20px 0;">
      <p style="margin: 0;">
        Please make sure to arrive at least <strong>10 minutes early</strong> for your appointment.
      </p>
    </div>

    <p>
      If you have any questions or need to reschedule, feel free to contact our support team.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 15px; font-size: 14px;">
      <tr>
        <td>
          <p>Best regards,</p>
          <p><strong>The Team</strong></p>
        </td>
      </tr>
    </table>

  </div>
`;
