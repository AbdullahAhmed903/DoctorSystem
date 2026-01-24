export const cancelAppointmentTemplate = ({
  patientName,
  doctorName,
  doctorEmail,
  date,
  typeOfPayment,
  paymentStatus,
  appointmentId
}) => `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; padding: 20px;">

    <!-- Header -->
    <h2 style="color: #e63946; border-bottom: 2px solid #eee; padding-bottom: 10px; text-align:center;">
        Appointment Cancellation Notice
    </h2>

    <!-- Greeting -->
    <p>Dear <strong>${patientName}</strong>,</p>

    <p>
        We regret to inform you that your upcoming appointment has been <strong style="color:#e63946;">cancelled</strong>. Please find the details below:
    </p>

    <!-- Appointment Details -->
    <table style="width:100%; margin-top: 15px; border-collapse: collapse;">
        <tr>
            <td style="font-weight:bold; width:40%; padding: 8px; border-bottom: 1px solid #ddd;">Doctor Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${doctorName}</td>
        </tr>
        <tr>
            <td style="font-weight:bold; padding: 8px; border-bottom: 1px solid #ddd;">Doctor Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${doctorEmail}</td>
        </tr>
        <tr>
            <td style="font-weight:bold; padding: 8px; border-bottom: 1px solid #ddd;">Appointment Date:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${date}</td>
        </tr>
        <tr>
            <td style="font-weight:bold; padding: 8px; border-bottom: 1px solid #ddd;">Type of Payment:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${typeOfPayment}</td>
        </tr>
        <tr>
            <td style="font-weight:bold; padding: 8px; border-bottom: 1px solid #ddd;">Payment Status:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${paymentStatus}</td>
        </tr>
        <tr>
            <td style="font-weight:bold; padding: 8px;">Appointment ID:</td>
            <td style="padding: 8px;">${appointmentId}</td>
        </tr>
    </table>

    <p>
        ${paymentStatus === "PAID" ? "Your payment will be <strong>refunded automatically</strong>. You will receive a confirmation once the refund is processed." : ""}
    </p>

    <p>We apologize for any inconvenience caused. Please feel free to contact your doctor or our support team for rescheduling.</p>

    <!-- Footer -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; font-size: 14px;">
        <tr>
            <td>
                <p>Best Regards,</p>
                <p><strong>Your Clinic Team</strong></p>
            </td>
        </tr>
    </table>
</div>
`;
