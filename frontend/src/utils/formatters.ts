import { businessDateAndSlotToUtcIso } from "./business-timezone";

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function buildSlotISO(date: Date, slot: string): string {
  return businessDateAndSlotToUtcIso(date, slot);
}
