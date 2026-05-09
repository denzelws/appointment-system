import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import Fastify from "fastify";
import { errorHandler } from "../interfaces/middleware/error.middleware";
import { appointmentRoutes } from "../interfaces/routes/appointment.routes";
import { authRoutes } from "../interfaces/routes/auth.routes";
import { closeDb, db } from "./database";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  app.setErrorHandler(errorHandler);

  app.get("/health", async () => {
    const dbOk = await db
      .raw("SELECT 1")
      .then(() => true)
      .catch(() => false);
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      database: dbOk ? "connected" : "disconnected",
    };
  });

  await app.register(authRoutes, { prefix: "/api/v1" });
  await app.register(appointmentRoutes, { prefix: "/api/v1" });

  const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      app.log.info(`Received ${signal}, shutting down gracefully...`);
      await closeDb();
      process.exit(0);
    });
  });

  return app;
}
