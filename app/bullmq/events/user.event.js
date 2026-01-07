// src/events/user.events.js

import { emailQueue } from "../queues/email.queue.js";


export const emitUserSignup = async ({ host,protocol,token,data}) => {
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
