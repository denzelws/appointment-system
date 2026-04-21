import { AvailabilityConfig } from "../entities/AvailabilityConfig";

export class AvailabilityRules {
  static isWithinBusinessHours(
    config: AvailabilityConfig,
    startTime: Date,
    endTime: Date,
  ): boolean {
    if (!config.isActive) {
      return false;
    }

    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);
    const openMinutes = this.timeStringToMinutes(config.openTime);
    const closeMinutes = this.timeStringToMinutes(config.closeTime);

    return startMinutes >= openMinutes && endMinutes <= closeMinutes;
  }

  static isDayActive(config: AvailabilityConfig | null): boolean {
    return config !== null && config.isActive;
  }

  static doesEndTimeExceedCloseTime(
    config: AvailabilityConfig,
    startTime: Date,
    endTime: Date,
  ): boolean {
    const endMinutes = this.timeToMinutes(endTime);
    const closeMinutes = this.timeStringToMinutes(config.closeTime);
    return endMinutes > closeMinutes;
  }

  private static timeToMinutes(date: Date): number {
    return date.getUTCHours() * 60 + date.getUTCMinutes();
  }

  private static timeStringToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }
}
