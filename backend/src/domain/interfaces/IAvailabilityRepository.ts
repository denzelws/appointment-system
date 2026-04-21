import { AvailabilityConfig } from "../entities/AvailabilityConfig";
import { DayOfWeek } from "../value-objects/DayOfWeek";

export interface IAvailabilityRepository {
  findByDayOfWeek(dayOfWeek: DayOfWeek): Promise<AvailabilityConfig | null>;
  findAll(): Promise<AvailabilityConfig[]>;
}
