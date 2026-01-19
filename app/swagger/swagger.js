import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Doctor-System API",
      version: "1.0.0",
    },
  servers: [
  {
    url: "http://localhost:3000/api/v1",
    description: "Local development",
  },
  {
    url: "https://doctor-system-lemon.vercel.app/api/v1",
    description: "Production",
  },
],
  components: {
      securitySchemes: {
    BedoAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "Use format: bedo <JWT>",
    },
  },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],


  },
  apis: ["./app/swagger/docs/*.swagger.js"],

};

export const swaggerSpec = swaggerJSDoc(options);
