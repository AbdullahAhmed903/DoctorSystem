// queueRedis.js
import IORedis from "ioredis";
import logger from "../../config/logger.js";

export const queueRedis = new IORedis("redis://default:dNeqhcTgxHzZnkOixWvxtRfFoqJDzUDT@turntable.proxy.rlwy.net:43930",{
  maxRetriesPerRequest: null,
});


queueRedis.on("connect", () => {
  logger.info("✅ Redis connected");
});

queueRedis.on("error", (err) => {
logger.info("❌ Redis connection error:", err);
});

await queueRedis.ping();