import { createClient } from "redis";
import logger from "./logger.js";

const redisClient = createClient({
  // url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  //  socket: {
  //       connectTimeout: 5000, // ⛔ prevents 504
  //     },
});

// redisClient.on("connect", () =>  logger.info("✅ Connected to Redis successfully"));
// redisClient.on("error", (err) =>  logger.error("❌ Redis connection error:", err));


  

export default redisClient;
