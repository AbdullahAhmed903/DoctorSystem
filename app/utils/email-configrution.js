import nodemailer from 'nodemailer';
import CONFIG from '../../config/config.js';




const SEND_EMAIL_BY_NODEMAILER = async (
    dest,
    subject,
    message,
    attachments = []
) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: CONFIG.NODEMAILER_EMAIL_FROM,
                pass: CONFIG.NODEMAILER_API_KEY,
            },
        });
        // send mail with defined transport object
        const info = await transporter.sendMail({
        from: `DoctorSystem ${process.env.nodeMailerEmail}`, // sender address
        to: dest, // list of receivers
        subject: subject, // Subject line
        html: message, // html body
        attachments,
    });
    return info;
};


export { SEND_EMAIL_BY_NODEMAILER };