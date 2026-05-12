import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import type { DayOfWeek } from "../../domain/value-objects/DayOfWeek";

export const BUSINESS_TIMEZONE = "America/Sao_Paulo";

export function businessDateToUtcRange(date: string): {
  startUtc: Date;
  endUtc: Date;
} {
  const startUtc = fromZonedTime(`${date}T00:00:00.000`, BUSINESS_TIMEZONE);
  const nextDayUtc = fromZonedTime(
    `${addDaysToDateString(date, 1)}T00:00:00.000`,
    BUSINESS_TIMEZONE,
  );

  return {
    startUtc,
    endUtc: new Date(nextDayUtc.getTime() - 1),
  };
}

export function businessDateAndSlotToUtc(date: string, slot: string): Date {
  const { hours, minutes } = parseSlotToTime(slot);
  return fromZonedTime(
    `${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00.000`,
    BUSINESS_TIMEZONE,
  );
}

export function getBusinessDayOfWeek(date: Date): DayOfWeek {
  return toZonedTime(date, BUSINESS_TIMEZONE).getDay() as DayOfWeek;
}

export function getBusinessMinutesOfDay(date: Date): number {
  const businessDate = toZonedTime(date, BUSINESS_TIMEZONE);
  return businessDate.getHours() * 60 + businessDate.getMinutes();
}

export function formatBusinessSlotLabel(date: Date): string {
  return formatInTimeZone(date, BUSINESS_TIMEZONE, "hh:mm a");
}

function parseSlotToTime(slot: string): { hours: number; minutes: number } {
  const [timePart, period] = slot.split(" ");
  const [rawHours, minutes] = timePart.split(":").map(Number);
  let hours = rawHours;

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
}

function addDaysToDateString(date: string, days: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day + days));

  return [
    utcDate.getUTCFullYear(),
    String(utcDate.getUTCMonth() + 1).padStart(2, "0"),
    String(utcDate.getUTCDate()).padStart(2, "0"),
  ].join("-");
}
