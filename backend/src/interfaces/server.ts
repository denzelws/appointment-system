import "dotenv/config";
import "../telemetry";

import { buildApp } from "../infrastructure/app";
import { validateEnv } from "../infrastructure/config/env";

async function start() {
  let app;
  try {
    const env = validateEnv();
    app = await buildApp();

    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    console.log(`🚀 Server running on http://localhost:${env.PORT}`);
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    if (app) {
      app.log.error(err);
    }
    process.exit(1);
  }
}

start();
