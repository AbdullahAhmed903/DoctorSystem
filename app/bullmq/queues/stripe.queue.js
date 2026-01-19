import { Queue } from "bullmq";
import { queueRedis } from "../queue-redis.js";

export const stripeQueue = new Queue("stripe-events", {
  connection: queueRedis
});
