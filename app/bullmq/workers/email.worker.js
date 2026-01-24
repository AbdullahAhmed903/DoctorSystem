import 'dotenv/config';
import mongoose from "mongoose";
await mongoose.connect(dbConfig.url);
import { Worker } from "bullmq";
import logger from "../../../config/logger.js";
import { sendEmail } from "../../utils/emails/email-service.js";
import appointmentModel from "../../DB/models/appointment-schema.js";
import invoiceModel from "../../DB/models/invoice-schema.js";
import { generateInvoiceNumber } from "../../utils/utills-service.js";
import { queueRedis } from "../queue-redis.js";
import {generateInvoicePDFBuffer, uploadInvoiceBufferToImageKit } from "../../service/invoicePdf-service.js";
import Doctor from "../../DB/models/doctor-schema.js";
import patientModel from "../../DB/models/patient-schema.js";
import dbConfig from '../../DB/db-config.js';
import Stripe from 'stripe';


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
        throw err; 
      }
    }
  },
  { connection:queueRedis , concurrency: 5 }
);


new Worker(
  "stripe-events",
  async (job) => {
    try {
      if (job.name !== "SEND_PAYMENT_SUCCESS_EMAIL") return;
      const { email, name, appointmentId } = job.data;
      const appointment = await appointmentModel.findOne({ appointmentId });
      if (!appointment) {
        logger.error(`❌ Appointment not found: ${appointmentId}`);
        return;
      }

      const doctorData = await Doctor
        .findOne({doctorId:appointment.doctorId})
        .select("email name");

      const patientData = await patientModel
        .findOne({patientId:appointment.patientId})
        .select("email name");


      let invoice = await invoiceModel.findOne({ appointmentId });

      if (!invoice) {
        invoice = await invoiceModel.create({
          invoiceNumber: generateInvoiceNumber(),
          appointmentId,
          userId: appointment.patientId,
          amount: appointment.fees.amount,
          currency: appointment.fees.currency,
          paymentMethod: "Stripe",
          status: "Paid",
          doctorName: doctorData.name,
        });
      }


  const pdfBuffer = await generateInvoicePDFBuffer(invoice, appointment, doctorData.name, patientData.name,patientData.email);

      const invoiceUrl = await uploadInvoiceBufferToImageKit(pdfBuffer, `invoice-${invoice.invoiceNumber}.pdf`);
      await invoiceModel.updateOne(
        { appointmentId,invoiceNumber:invoice.invoiceNumber },
        { $set: { invoiceUrl } }
      );
      console.log(invoiceUrl);
      
      await sendEmail({
        email,
        type: "PAYMENT_SUCCESS",
        payload: { email, name,invoiceUrl },
      });

      logger.info(`✅ Payment success email sent to ${email}`);
    } catch (err) {
      logger.error("❌ Stripe worker failed:", err);
      throw err; 
    }
  },
  { connection: queueRedis, concurrency: 5 }
);




new Worker(
  "cancel-appointment",
  async (job) => {
    const stripe = new Stripe(process.env.STRIP_KEY);

    try {
          if (job.name === "CANCEL_APPOITMENT") {
      const {appointmentId,date,status,paymentStatus,typeOfPayment,doctorName,doctorEmail,patientName,patientEmail,paymentIntentId}=job.data;      
      try {        
        await sendEmail({email:patientEmail,type:"CANCEL_APPOINTMENT_PATIENT",payload:{doctorName,patientName,doctorEmail,date,appointmentId,status,paymentStatus,typeOfPayment}});
        logger.info(`✅ Cancel appointment email sent to ${patientEmail}`);
      } catch (err) {
        logger.error("❌ Cancel appointment Email send error:", err);
        throw err; 
      }

      if (paymentStatus === "paid" && typeOfPayment === "credit_card" && paymentIntentId) {        
          const refund = await stripe.refunds.create({ payment_intent: paymentIntentId });
          logger.info(`💰 Refund processed for appointment ${appointmentId}, Refund ID: ${refund.id}`);

          await appointmentModel.findOneAndUpdate({appointmentId}, {
            paymentStatus: "refunded",
            status:"cancelled"
          });
        }
        else if (typeOfPayment==="cash"){
            await appointmentModel.findOneAndUpdate({appointmentId}, {
            paymentStatus: "refunded",
            status:"cancelled"
          });
        }
    }
    } catch (err) {
      logger.error("❌ Stripe worker failed:", err);
      throw err; 
    }

  },
  { connection:queueRedis , concurrency: 5 }
);