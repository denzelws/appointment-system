import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { SpanStatusCode, trace } from "@opentelemetry/api";
import Fastify from "fastify";
import { errorHandler } from "../interfaces/middleware/error.middleware";
import { appointmentRoutes } from "../interfaces/routes/appointment.routes";
import { authRoutes } from "../interfaces/routes/auth.routes";
import { fastifyOtelInstrumentation } from "../telemetry";
import { closeDb, db } from "./database";
import { getAllowedOrigins, getEnv } from "./config/env";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(fastifyOtelInstrumentation.plugin());

  app.addHook("onResponse", async (request, reply) => {
    const span = trace.getActiveSpan();

    if (!span) return;

    span.setAttribute("http.status_code", reply.statusCode);
    span.setAttribute("http.response.status_code", reply.statusCode);
    span.setAttribute("http.method", request.method);
    span.setAttribute("http.request.method", request.method);
    span.setAttribute("http.route", request.routeOptions?.url ?? request.url);
    span.setAttribute("url.path", request.url);
    span.setAttribute("fastify.response_time_ms", reply.elapsedTime);

    if (reply.statusCode >= 500) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: `HTTP ${reply.statusCode}`,
      });
    }
  });

  const env = getEnv();
  const allowedOrigins = getAllowedOrigins(env);

  if (env.NODE_ENV === "production" && allowedOrigins === false) {
    app.log.warn(
      "ALLOWED_ORIGINS is not set in production: cross-origin browser requests will be rejected. Set ALLOWED_ORIGINS to a comma-separated list of trusted origins.",
    );
  }

  await app.register(cors, {
    origin: allowedOrigins,
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
