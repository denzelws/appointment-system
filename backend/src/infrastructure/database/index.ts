import knex from "knex";
import config from "./knexfile";

const env = (process.env.NODE_ENV || "development") as keyof typeof config;

export const db = knex(config[env]);

export async function closeDb(): Promise<void> {
  await db.destroy();
}
