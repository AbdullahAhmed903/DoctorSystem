export const codeTemplate=({name,verificationCode,codeMessage})=>
      `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; padding: 20px;">

            <!-- Header -->
            <h2 style="color: #1a73e8; border-bottom: 2px solid #eee; padding-bottom: 10px; text-align:center;">
                Email Change Verification
            </h2>

            <!-- Greeting -->
            <p>Dear <strong>${name}</strong>,</p>

            <p>
                ${codeMessage}.<br>
                To complete this process, please use the verification code below:
            </p>

            <!-- Code Box -->
            <div style="text-align: center; margin: 25px 0;">
                <div style="
                    display: inline-block;
                    font-size: 32px;
                    font-weight: bold;
                    background-color: #f5f5f5;
                    padding: 12px 25px;
                    border-radius: 8px;
                    letter-spacing: 4px;
                    border: 1px solid #ddd;
                ">
                    ${verificationCode}
                </div>
            </div>

            <p>
                This code will expire in <strong>5 minutes</strong>.
            </p>

            <!-- Security Notice -->
            <div style="background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba; padding: 10px 15px; border-radius: 5px; margin-top: 20px;">
                <strong>Security Notice:</strong><br>
                If you <strong>did not request</strong> this, please ignore this message.  
            </div>

            <!-- Footer -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; font-size: 14px;">
                <tr>
                    <td>
                        <p>Best Regards,</p>
                        <p><strong>Abdullah Ahmed</strong></p>
                    </td>
                </tr>
            </table>
        </div>
        `;
