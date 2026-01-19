import dotenv from 'dotenv';
dotenv.config();
import { Worker } from "bullmq";
import logger from "../../../config/logger.js";
import { sendEmail } from "../../utils/emails/email-service.js";
import appointmentModel from "../../DB/models/appointment-schema.js";
import invoiceModel from "../../DB/models/invoice-schema.js";
import { generateInvoiceNumber } from "../../utils/utills-service.js";
import { queueRedis } from "../queue-redis.js";


new Worker(
  "emailQueue",
  async (job) => {
    if (job.name === "SEND_VERIFY_EMAIL") {
      const { host,protocol,token,data } = job.data;      
      const link = `${protocol}://${host}/api/v1/auth/verifyEmail/${token}`;            
      try {        
        await sendEmail({email:data.email,type:"VERIFY_EMAIL",payload:{email:data.email,name:data.name,link:link}});
        logger.info(`✅ Verification email sent to ${data.email}`);
      } catch (err) {
        logger.error("❌ Email send error:", err);
        throw err; // BullMQ will retry automatically
      }
    }
  },
  { connection:queueRedis , concurrency: 5 }
);


new Worker(
  "stripe-events",
  async (job) => {
    console.log("inside stripe worker");
    
    if (job.name === "SEND_PAYMENT_SUCCESS_EMAIL") {
      console.log("ggggggggggggggggggggg");
      
      const { email,name,appointmentId } = job.data;
      const appointment = await appointmentModel.findOne({ appointmentId }).populate("doctorDetails clinicDetails");
      console.log(appointment);
      
       if (!appointment) {
      logger.error(`❌ Appointment not found: ${appointmentId}`);
      return;
    }
       const existingInvoice = await invoiceModel.findOne({ appointmentId });
        let invoice
       if(!existingInvoice){
        invoice=new invoiceModel({
        invoiceNumber:generateInvoiceNumber(),
        appointmentId:appointmentId,
        userId:data.patientId,
        amount:data.fees.amount,
        currency:data.fees.currency,
        paymentMethod:"Stripe",
        status:"Paid",
      });
        await invoice.save();
       }
        const { filePath, fileName } = await generateInvoicePDF(
    invoice,
    appointment,
    appointment.patientId
    );
      try {
        await sendEmail({email:email,type:"PAYMENT_SUCCESS",payload:{email,name},attachments:[{filename:fileName,path:filePath}]});
        logger.info(`✅ Payment success email sent to ${email}`);
      }
      catch (err) {
        logger.error("❌ Email send error:", err);
        throw err; // BullMQ will retry automatically
      }
    }
  }
  , { connection:queueRedis , concurrency: 5 }
);