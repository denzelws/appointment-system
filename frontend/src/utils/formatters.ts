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
  let [hours, minutes] = timePart.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result.toISOString();
}
