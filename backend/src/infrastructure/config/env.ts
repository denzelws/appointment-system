import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  JWT_SECRET: z
    .string({ required_error: "JWT_SECRET is required" })
    .min(32, "JWT_SECRET must have at least 32 characters"),
  DB_HOST: z.string({ required_error: "DB_HOST is required" }).min(1, "DB_HOST is required"),
  DB_PORT: z.coerce
    .number({ invalid_type_error: "DB_PORT must be a number" })
    .int("DB_PORT must be an integer")
    .min(1, "DB_PORT must be between 1 and 65535")
    .max(65535, "DB_PORT must be between 1 and 65535"),
  DB_USER: z.string({ required_error: "DB_USER is required" }).min(1, "DB_USER is required"),
  DB_PASSWORD: z.string({ required_error: "DB_PASSWORD is required" }).min(1, "DB_PASSWORD is required"),
  DB_NAME: z.string({ required_error: "DB_NAME is required" }).min(1, "DB_NAME is required"),
  PORT: z.coerce
    .number({ invalid_type_error: "PORT must be a number" })
    .int("PORT must be an integer")
    .min(1, "PORT must be between 1 and 65535")
    .max(65535, "PORT must be between 1 and 65535")
    .default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  ALLOWED_ORIGINS: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function formatIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
}

function buildTestFallback(): Env {
  return {
    JWT_SECRET: "test-secret-with-at-least-32-characters!!",
    DB_HOST: "localhost",
    DB_PORT: 5432,
    DB_USER: "test",
    DB_PASSWORD: "test",
    DB_NAME: "test",
    PORT: 3000,
    NODE_ENV: "test",
    ALLOWED_ORIGINS: undefined,
  };
}

export function validateEnv(source: NodeJS.ProcessEnv = process.env): Env {
  // Vitest (`npm test`) exercises pure domain rules without infrastructure.
  // Use safe in-memory defaults so unit tests stay local and offline.
  if (source.VITEST === "true" || source.NODE_ENV === "test") {
    return buildTestFallback();
  }

  const parsed = envSchema.safeParse(source);

  if (!parsed.success) {
    const details = formatIssues(parsed.error);
    throw new Error(
      `Invalid environment configuration:\n${details}\nCheck backend/.env.example for required variables.`,
    );
  }

  return parsed.data;
}

let cachedEnv: Env | undefined;

export function getEnv(source: NodeJS.ProcessEnv = process.env): Env {
  if (!cachedEnv) {
    cachedEnv = validateEnv(source);
  }
  return cachedEnv;
}

export function getAllowedOrigins(source: Env = getEnv()): string[] | true | false {
  if (source.NODE_ENV !== "production") {
    return true;
  }

  const raw = source.ALLOWED_ORIGINS?.trim();
  if (!raw) {
    return false;
  }

  const origins = raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length > 0 ? origins : false;
}
