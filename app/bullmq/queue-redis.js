import CONFIG from '../../config/config.js';
import IORedis from "ioredis";
import logger from "../../config/logger.js";


export const queueRedis = new IORedis(CONFIG.REDIS_URL, {
  maxRetriesPerRequest: null,
});

queueRedis.on("connect", () => {
  logger.info("✅ Redis connected");
});

queueRedis.on("error", (err) => {
  logger.error("❌ Redis connection error", err);
});
