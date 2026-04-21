import { Appointment } from "../entities/Appointment";
import { AppointmentStatus } from "../value-objects/AppointmentStatus";

export class AppointmentRules {
  static isNotInPast(startTime: Date): boolean {
    const now = new Date();
    const tolerance = new Date(now.getTime() + 60 * 1000);
    return startTime > tolerance;
  }

  static hasConflict(
    existingAppointments: Appointment[],
    newStartTime: Date,
    newEndTime: Date,
  ): boolean {
    return existingAppointments.some((apt) => {
      if (!apt.isActive()) return false;

      const existingStart = apt.startTime.getTime();
      const existingEnd = apt.endTime.getTime();
      const newStart = newStartTime.getTime();
      const newEnd = newEndTime.getTime();

      return newStart < existingEnd && newEnd > existingStart;
    });
  }

  static calculateEndTime(startTime: Date, durationMinutes: number): Date {
    return new Date(startTime.getTime() + durationMinutes * 60 * 1000);
  }

  static canCancel(appointment: Appointment): boolean {
    return appointment.status !== "CANCELLED";
  }

  static isValidTransition(
    currentStatus: AppointmentStatus,
    newStatus: AppointmentStatus,
  ): boolean {
    const transitions: Record<AppointmentStatus, AppointmentStatus[]> = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["CANCELLED"],
      CANCELLED: [],
    };
    return transitions[currentStatus].includes(newStatus);
  }
}
