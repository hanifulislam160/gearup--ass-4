import { authDocs } from "./auth.docs";
import { userDocs } from "./user.docs";

export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "RentNest - Gear Rental & Management Platform API Docs",
    version: "1.0.0",
    description: "API documentation map for the RentNest multi-role platform.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local Development Server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],

  paths: {
    ...authDocs,
    ...userDocs,
  },
};
