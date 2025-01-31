import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Another Knowledge Base API",
      version: "1.0.0",
      description: "Документация API для базы знаний",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Локальный сервер",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Подключаем все маршруты
};

const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
