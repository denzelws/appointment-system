import { format } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

export const BUSINESS_TIMEZONE = "America/Sao_Paulo";

export function formatCalendarDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function businessDateAndSlotToUtcIso(date: Date, slot: string): string {
  const businessDate = formatCalendarDate(date);
  const { hours, minutes } = parseSlotToTime(slot);

  return fromZonedTime(
    `${businessDate}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00.000`,
    BUSINESS_TIMEZONE,
  ).toISOString();
}

export function formatBusinessTime(isoDate: string): string {
  return formatInTimeZone(isoDate, BUSINESS_TIMEZONE, "hh:mm a");
}

export function formatBusinessDate(isoDate: string): string {
  return formatInTimeZone(isoDate, BUSINESS_TIMEZONE, "EEE, d MMM");
}

function parseSlotToTime(slot: string): { hours: number; minutes: number } {
  const [timePart, period] = slot.split(" ");
  const [rawHours, minutes] = timePart.split(":").map(Number);
  let hours = rawHours;

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
}
