import { AvailabilityConfig } from "../../../domain/entities/AvailabilityConfig";
import { IAvailabilityRepository } from "../../../domain/interfaces/IAvailabilityRepository";
import { DayOfWeek } from "../../../domain/value-objects/DayOfWeek";
import { db } from "../index";

interface AvailabilityRow {
  id: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  slot_duration_minutes: number;
  is_active: boolean;
}

export class KnexAvailabilityRepository implements IAvailabilityRepository {
  async findByDayOfWeek(
    dayOfWeek: DayOfWeek,
  ): Promise<AvailabilityConfig | null> {
    const row = await db("availability_configs")
      .where({ day_of_week: dayOfWeek })
      .first();

    if (!row) return null;
    return this.mapRowToEntity(row as AvailabilityRow);
  }

  async findAll(): Promise<AvailabilityConfig[]> {
    const rows = await db("availability_configs").select("*");
    return (rows as AvailabilityRow[]).map((row) => this.mapRowToEntity(row));
  }

  private mapRowToEntity(row: AvailabilityRow): AvailabilityConfig {
    return new AvailabilityConfig({
      id: row.id,
      dayOfWeek: row.day_of_week as DayOfWeek,
      openTime: row.open_time,
      closeTime: row.close_time,
      slotDurationMinutes: row.slot_duration_minutes,
      isActive: row.is_active,
    });
  }
}
