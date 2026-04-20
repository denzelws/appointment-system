import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw("CREATE EXTENSION IF NOT EXISTS btree_gist");

  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.string("name", 255).notNullable();
    table.string("email", 255).unique().notNullable();
    table.string("password_hash", 255).notNullable();
    table.enum("role", ["USER", "ADMIN"]).notNullable().defaultTo("USER");
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable("users", (table) => {
    table.index("email");
  });

  await knex.schema.createTable("availability_configs", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table.integer("day_of_week").notNullable();
    table.time("open_time").notNullable();
    table.time("close_time").notNullable();
    table.integer("slot_duration_minutes").notNullable().defaultTo(30);
    table.boolean("is_active").notNullable().defaultTo(true);
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());

    table.unique("day_of_week");
  });

  await knex.raw(`
    ALTER TABLE availability_configs
    ADD CONSTRAINT day_of_week_valid
    CHECK (day_of_week IN (0,1,2,3,4,5,6))
`);

  await knex.schema.createTable("appointments", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.timestamp("start_time", { useTz: true }).notNullable();
    table.timestamp("end_time", { useTz: true }).notNullable();
    table
      .enum("status", ["PENDING", "CONFIRMED", "CANCELLED"])
      .notNullable()
      .defaultTo("PENDING");
    table.string("notes", 500).nullable();
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp("updated_at", { useTz: true }).defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable("appointments", (table) => {
    table.index("user_id");
    table.index("start_time");
    table.index("status");
    table.index(["user_id", "status"]);
    table.index(["start_time", "status"]);
  });

  await knex.raw(`
    ALTER TABLE appointments 
    ADD CONSTRAINT no_overlapping_appointments 
    EXCLUDE USING gist (
      tstzrange(start_time, end_time) WITH &&
    ) WHERE (status != 'CANCELLED')
  `);

  await knex.schema.createTable("audit_logs", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("user_id")
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.string("event_type", 50).notNullable();
    table
      .uuid("appointment_id")
      .nullable()
      .references("id")
      .inTable("appointments")
      .onDelete("SET NULL");
    table.jsonb("payload").notNullable().defaultTo("{}");
    table.timestamp("created_at", { useTz: true }).defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable("audit_logs", (table) => {
    table.index("event_type");
    table.index("user_id");
    table.index("created_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("audit_logs");
  await knex.schema.dropTableIfExists("appointments");
  await knex.schema.dropTableIfExists("availability_configs");
  await knex.schema.dropTableIfExists("users");
}
