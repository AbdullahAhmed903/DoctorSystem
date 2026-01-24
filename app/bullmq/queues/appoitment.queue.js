import { Queue } from "bullmq";
import { queueRedis } from "../queue-redis.js";

export const appointmentQueue = new Queue("cancel-appointment", {
  connection: queueRedis
});
