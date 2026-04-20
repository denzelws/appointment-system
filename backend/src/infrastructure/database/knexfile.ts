import dotenv from "dotenv";
import type { Knex } from "knex";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const baseConfig: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  },
  pool: {
    min: 0,
    max: 10,
  },
  acquireConnectionTimeout: 30000,
  migrations: {
    tableName: "knex_migrations",
    directory: path.join(__dirname, "../migrations"),
    extension: "ts",
  },
  seeds: {
    directory: path.join(__dirname, "../seeds"),
    extension: "ts",
  },
};

const config: Record<string, Knex.Config> = {
  development: baseConfig,
  production: {
    ...baseConfig,
    pool: { min: 2, max: 20 },
  },
};

export default config;
