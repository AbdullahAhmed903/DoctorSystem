import express from "express";
import CONFIG from "./config/config.js";
import logger from "./config/logger.js";
import morgan from "morgan";
import { v1routes } from "./app/routers-index.js";
import { constants, sendResponse } from "./app/utils/utills-service.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectiondb from "./app/DB/connection-db.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./app/swagger/swagger.js";
import path from "path";

// ================== APP ==================
const app = express();
app.set("trust proxy", 1);

// ================== CORS ==================
const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};

app.use(cors(corsConfig));

// ================== MIDDLEWARES ==================
app.use(cookieParser());

app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/appointment/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));

// ================== DB ==================
new connectiondb();

// ================== LOGGER ==================
morgan.token("id", (req) => req.id);
app.use(
  morgan(":id :method :url :status :response-time ms", {
    stream: logger.stream,
  })
);

// ================== SWAGGER JSON ==================
app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

// ================== SWAGGER UI ==================
if (CONFIG.NODE_ENV === "development") {
  // Local
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} else {
  // Production - serve static Swagger UI
  app.use(
    "/api-docs",
    express.static(path.join(process.cwd(), "public/swagger-ui"))
  );
  // أي طلب `/api-docs/*` يرجع index.html
  app.get("/api-docs/*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public/swagger-ui/index.html"));
  });
}
// ================== ROUTES ==================
v1routes(app);

// ================== ROOT ==================
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Doctor System API" });
});

// ================== 404 ==================
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

// ================== ERROR HANDLER ==================
app.use((err, req, res, next) => {
  const statusCode = err.status || constants.RESPONSE_INT_SERVER_ERROR;

  if (CONFIG.NODE_ENV === "development") {
    sendResponse(res, statusCode, err.message, {}, err.stack);
    logger.error(
      `${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method}`
    );
  } else {
    sendResponse(res, statusCode, err.message);
    logger.error(
      `${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method}`
    );
  }
});

// ================== LISTEN (LOCAL ONLY) ==================
if (CONFIG.NODE_ENV === "development") {
  app.listen(CONFIG.PORT, () => {
    logger.info(`Server running on port ${CONFIG.PORT}`);
  });
}

export default app;
