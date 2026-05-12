export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function buildSlotISO(date: Date, slot: string): string {
  const [timePart, period] = slot.split(" ");
  const [rawHours, minutes] = timePart.split(":").map(Number);
  let hours = rawHours;

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
    ),
  ).toISOString();
}
