export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export const AppointmentStatus = {
  isValid(status: string): status is AppointmentStatus {
    return ["PENDING", "CONFIRMED", "CANCELLED"].includes(status);
  },
} as const;
