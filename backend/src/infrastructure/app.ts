import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { closeDb, db } from "./database";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

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
