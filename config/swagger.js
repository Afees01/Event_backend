const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event Management API",
      version: "1.0.0",
      description: "API documentation for Event Management System",
    },
    servers: [
      {
        url: "http://192.168.1.114:3000",

      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },
  apis: ["./routes/*.js"], // swagger will read route comments
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};