import { format } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

export const BUSINESS_TIMEZONE = "America/Sao_Paulo";

export function formatCalendarDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function businessDateAndSlotToUtcIso(date: Date, slot: string): string {
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid appointment date");
  }

  const businessDate = formatCalendarDate(date);
  const { hours, minutes } = parseSlotToTime(slot);
  const utcDate = fromZonedTime(
    `${businessDate}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00.000`,
    BUSINESS_TIMEZONE,
  );

  if (Number.isNaN(utcDate.getTime())) {
    throw new Error(`Invalid appointment slot: ${slot}`);
  }

  return utcDate.toISOString();
}

export function formatBusinessTime(isoDate: string): string {
  return formatInTimeZone(isoDate, BUSINESS_TIMEZONE, "hh:mm a");
}

export function formatBusinessDate(isoDate: string): string {
  return formatInTimeZone(isoDate, BUSINESS_TIMEZONE, "EEE, d MMM");
}

export function getBusinessDateSearchParts(isoDate: string): string[] {
  return [
    formatBusinessDate(isoDate),
    formatInTimeZone(isoDate, BUSINESS_TIMEZONE, "EEEE"),
    formatInTimeZone(isoDate, BUSINESS_TIMEZONE, "EEE"),
    formatInTimeZone(isoDate, BUSINESS_TIMEZONE, "d"),
    formatInTimeZone(isoDate, BUSINESS_TIMEZONE, "MMMM"),
    formatInTimeZone(isoDate, BUSINESS_TIMEZONE, "MMM"),
  ];
}

function parseSlotToTime(slot: string): { hours: number; minutes: number } {
  const match = slot.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/);

  if (!match) {
    throw new Error(`Invalid appointment slot: ${slot}`);
  }

  const [, rawHoursText, minutesText, period] = match;
  const rawHours = Number(rawHoursText);
  const minutes = Number(minutesText);

  if (
    !Number.isInteger(rawHours) ||
    !Number.isInteger(minutes) ||
    rawHours < 1 ||
    rawHours > 12 ||
    minutes < 0 ||
    minutes > 59
  ) {
    throw new Error(`Invalid appointment slot: ${slot}`);
  }

  let hours = rawHours;

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
}
