import CONFIG from "../../../../config/config.js";

export const verifyEmailTemplate=({email,name,link})=>
    `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 20px auto; border: 1px solid #dddddd; padding: 20px;">
                
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px; font-size: 14px;">
                    <tr>
                        <td style="padding-bottom: 5px;"><strong>From:</strong> ${CONFIG.NODEMAILER_EMAIL_FROM}</td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 20px;"><strong>To:</strong> ${email}</td>
                    </tr>
                </table>
    
                <h2 style="color: #1a73e8; border-bottom: 2px solid #eeeeee; padding-bottom: 10px;">Account Registration Complete</h2>
    
                <p>Dear <strong>${name}</strong>,</p>
    
                <p>
                    Thank you for registering with us! You have successfully completed the initial sign-up process.
                </p>
    
                <p>
                    To secure your account and access all features, please click the confirmation button below:
                </p>
    
                <table width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="padding: 20px 0; text-align: center;">
                            <a href="${link}" target="_blank" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                Confirm My Account
                            </a>
                        </td>
                    </tr>
                </table>
    
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 15px; font-size: 14px;">
                    <tr>
                        <td>
                            <p>Best Regards,</p>
                            <p>The Team Name : </p>
                        </td>
                    </tr>
                </table>
            </div>
        `;
