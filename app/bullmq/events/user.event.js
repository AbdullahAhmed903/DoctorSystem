// src/events/user.events.js

import { appointmentQueue } from "../queues/appoitment.queue.js";
import { emailQueue } from "../queues/email.queue.js";
import { stripeQueue } from "../queues/stripe.queue.js";


export const emitUserSignup = async ({ host,protocol,token,data}) => {
  console.log("email job emitUserSignup called");
  
  await emailQueue.add(
    "SEND_VERIFY_EMAIL",
    { host,protocol,token,data },
    {
      attempts: 2,
      backoff: { type: "exponential", delay: 5000 } // retry 3 times with exponential delay
    }
  );

  console.log("✅ Job added to emailQueue");
};


export const emitUserpaymentSuccess = async ({ email,name,appointmentId }) => {
  
  await stripeQueue.add(
    "SEND_PAYMENT_SUCCESS_EMAIL",
    { email,name,appointmentId },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 } // retry 3 times with exponential delay
    }
  );
  console.log("✅ Payment success  job added to stripQueue");
}


export const emaitCancelAppoitment=async({appointmentId,date,status,paymentStatus,typeOfPayment,doctorName,doctorEmail,patientName,patientEmail,paymentIntentId})=>{  
  await appointmentQueue.add(
    "CANCEL_APPOITMENT",
    {appointmentId,date,status,paymentStatus,typeOfPayment,doctorName,doctorEmail,patientName,patientEmail,paymentIntentId},
    {
      attempts: 2,
      backoff: { type: "exponential", delay: 5000 }
    }
  )
  console.log("✅ cancel appoitment  job added to emailQueue");
}

