import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Doctor-System API",
      version: "1.0.0",
      description: "Swagger documentation for Doctor-System",
    },
    servers: [
      {
        url: "https://doctor-system-lemon.vercel.app/api/v1",
        description: "Production",
      },
      {
        url: "http://localhost:3000/api/v1",
        description: "Local Development",
      },
    ],
    components: {
      securitySchemes: {
        BedoAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "Use format: Bedo_<JWT>",
        },
      },
    },
    security: [
      {
        BedoAuth: [],
      },
    ],
  },
  apis: ["./app/swagger/docs/*.swagger.js"], // ملفات الـ swagger comments
};

export const swaggerSpec = swaggerJSDoc(options);

