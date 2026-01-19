
import logger from "./logger.js";
import { Redis } from "@upstash/redis";

const redisClient = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

console.log(process.env.UPSTASH_REDIS_REST_URL);

// optional health log (safe – no connection opened)
(async () => {
  try {
    await redisClient.ping();
    logger.info("✅ Upstash Redis connected");
  } catch (err) {
    logger.error("❌ Upstash Redis error", err);
  }
})();

export default redisClient;









//............this for local ...........//
//...I changed It  Because it make problem when deploy project on vercal...//


// import { createClient } from "redis";

// const redisClient = createClient({
// //   url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
// //    socket: {
// //         connectTimeout: 5000, // ⛔ prevents 504
// //       },
// });

// // redisClient.on("connect", () =>  logger.info("✅ Connected to Redis successfully"));
// redisClient.on("error", (err) =>  logger.error("❌ Redis connection error:", err));



// export default redisClient;
