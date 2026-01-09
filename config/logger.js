import winston, { createLogger, format, transports } from "winston";
import CONFIG from "./config.js";

/* ---------- Console Format ---------- */
class ConsoleFormat {
  static getFormat() {
    return format.combine(
      format.colorize(),
      format.timestamp({ format: "YYYY-MM-DD hh:mm:ss A" }),
      format.printf(
        ({ timestamp, level, message }) =>
          `${timestamp} ${level}: ${message}`
      )
    );
  }
}

/* ---------- File Format ---------- */
const fileFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json()
);

/* ---------- Transports ---------- */
const loggerTransports = [];

/* ✅ Always allow console logs (Vercel-safe) */
loggerTransports.push(
  new transports.Console({
    level: CONFIG.LOG_LEVEL || "info",
    format: ConsoleFormat.getFormat(),
    handleExceptions: true,
  })
);

/* ✅ File logging ONLY in local development */
if (CONFIG.NODE_ENV === "development") {
  loggerTransports.push(
    new transports.File({
      filename: CONFIG.LOG_FILE_LOCATION || "doctor-system.log",
      maxsize: 5242880,
      maxFiles: 5,
      handleExceptions: true,
    }),
    new transports.File({
      filename: "error.log",
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
      handleExceptions: true,
    })
  );
}

/* ---------- Logger ---------- */
const logger = createLogger({
  level: CONFIG.LOG_LEVEL || "info",
  format: fileFormat,
  transports: loggerTransports,
  exitOnError: false,
});

/* ---------- Stream (for morgan) ---------- */
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

export default logger;
