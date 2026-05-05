import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("availability_configs").del();

  await knex("availability_configs").insert([
    {
      day_of_week: 0,
      open_time: "09:00",
      close_time: "18:00",
      slot_duration_minutes: 30,
      is_active: false,
    }, // Domingo
    {
      day_of_week: 1,
      open_time: "09:00",
      close_time: "18:00",
      slot_duration_minutes: 30,
      is_active: true,
    }, // Segunda
    {
      day_of_week: 2,
      open_time: "09:00",
      close_time: "18:00",
      slot_duration_minutes: 30,
      is_active: true,
    }, // Terça
    {
      day_of_week: 3,
      open_time: "09:00",
      close_time: "18:00",
      slot_duration_minutes: 30,
      is_active: true,
    }, // Quarta
    {
      day_of_week: 4,
      open_time: "09:00",
      close_time: "18:00",
      slot_duration_minutes: 30,
      is_active: true,
    }, // Quinta
    {
      day_of_week: 5,
      open_time: "09:00",
      close_time: "18:00",
      slot_duration_minutes: 30,
      is_active: true,
    }, // Sexta
    {
      day_of_week: 6,
      open_time: "09:00",
      close_time: "14:00",
      slot_duration_minutes: 30,
      is_active: true,
    }, // Sábado
  ]);
}
