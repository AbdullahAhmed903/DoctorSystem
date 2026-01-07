// src/workers/email.worker.js
import { Worker } from "bullmq";
import redisClient from "../../../config/redis.js";
import logger from "../../../config/logger.js";
import { sendEmail } from "../../utils/emails/email-service.js";

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
  { connection: { client: redisClient }, concurrency: 5 }
);
