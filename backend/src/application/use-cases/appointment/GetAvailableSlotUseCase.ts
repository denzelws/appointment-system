import { IAppointmentRepository } from "../../../domain/interfaces/IAppointmentRepository";
import { IAvailabilityRepository } from "../../../domain/interfaces/IAvailabilityRepository";
import {
  businessDateAndSlotToUtc,
  businessDateToUtcRange,
  getBusinessDayOfWeek,
} from "../../../shared/time/business-timezone";

interface GetAvailableSlotsInput {
  date: string;
}

interface GetAvailableSlotsOutput {
  date: string;
  available: string[];
  unavailable: string[];
}

export class GetAvailableSlotsUseCase {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private availabilityRepo: IAvailabilityRepository,
  ) {}

  async execute(
    input: GetAvailableSlotsInput,
  ): Promise<GetAvailableSlotsOutput> {
    const { startUtc, endUtc } = businessDateToUtcRange(input.date);
    const dayOfWeek = getBusinessDayOfWeek(startUtc);

    const config = await this.availabilityRepo.findByDayOfWeek(dayOfWeek);

    if (!config || !config.isActive) {
      return { date: input.date, available: [], unavailable: [] };
    }

    const allSlots = this.generateSlots(
      config.openTime,
      config.closeTime,
      config.slotDurationMinutes,
    );

    const { appointments } = await this.appointmentRepo.findMany({
      startDate: startUtc,
      endDate: endUtc,
      page: 1,
      limit: 100,
      offset: 0,
    });

    const activeAppointments = appointments.filter(
      (a) => a.status !== "CANCELLED",
    );

    const unavailable = allSlots.filter((slot) => {
      const slotStart = businessDateAndSlotToUtc(input.date, slot);
      const slotEnd = new Date(
        slotStart.getTime() + config.slotDurationMinutes * 60 * 1000,
      );

      return activeAppointments.some((apt) => {
        const aptStart = apt.startTime.getTime();
        const aptEnd = apt.endTime.getTime();
        return slotStart.getTime() < aptEnd && slotEnd.getTime() > aptStart;
      });
    });

    const available = allSlots.filter((slot) => !unavailable.includes(slot));

    return { date: input.date, available, unavailable };
  }

  private generateSlots(
    openTime: string,
    closeTime: string,
    duration: number,
  ): string[] {
    const slots: string[] = [];
    const [openHour, openMin] = openTime.split(":").map(Number);
    const [closeHour, closeMin] = closeTime.split(":").map(Number);

    let current = openHour * 60 + openMin;
    const end = closeHour * 60 + closeMin;

    while (current + duration <= end) {
      const hours = Math.floor(current / 60);
      const minutes = current % 60;
      const period = hours >= 12 ? "PM" : "AM";
      const display = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      slots.push(
        `${String(display).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`,
      );
      current += duration;
    }

    return slots;
  }
}
