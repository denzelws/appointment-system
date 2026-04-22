import { Appointment } from "../../../domain/entities/Appointment";
import { ConflictException } from "../../../domain/errors/ConflictException";
import { DomainException } from "../../../domain/errors/DomainException";
import { IAppointmentRepository } from "../../../domain/interfaces/IAppointmentRepository";
import { IAuditLogRepository } from "../../../domain/interfaces/IAuditLogRepository";
import { IAvailabilityRepository } from "../../../domain/interfaces/IAvailabilityRepository";
import { AppointmentRules } from "../../../domain/rules/AppointmentRules";
import { AvailabilityRules } from "../../../domain/rules/AvailabilityRules";
import { DayOfWeek } from "../../../domain/value-objects/DayOfWeek";
import {
  AppointmentResponseDTO,
  CreateAppointmentDTO,
} from "../../dtos/AppointmentDTO";

export class CreateAppointmentUseCase {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private availabilityRepo: IAvailabilityRepository,
    private auditRepo: IAuditLogRepository,
  ) {}

  async execute(
    data: CreateAppointmentDTO,
    userId: string,
  ): Promise<AppointmentResponseDTO> {
    const startTime = new Date(data.startTime);

    if (!AppointmentRules.isNotInPast(startTime)) {
      await this.logAudit(userId, "APPOINTMENT_PAST", {
        startTime: data.startTime,
      });
      throw new DomainException("Não é possível agendar horários no passado.");
    }

    const dayOfWeek = startTime.getUTCDay() as DayOfWeek;
    const config = await this.availabilityRepo.findByDayOfWeek(dayOfWeek);

    if (!AvailabilityRules.isDayActive(config)) {
      await this.logAudit(userId, "APPOINTMENT_OUT_OF_HOURS", {
        startTime: data.startTime,
      });
      throw new DomainException("Dia não disponível para agendamentos.");
    }

    const endTime = AppointmentRules.calculateEndTime(
      startTime,
      config!.slotDurationMinutes,
    );

    if (!AvailabilityRules.isWithinBusinessHours(config!, startTime, endTime)) {
      await this.logAudit(userId, "APPOINTMENT_OUT_OF_HOURS", {
        startTime: data.startTime,
      });
      throw new DomainException("Horário fora do período de funcionamento.");
    }

    if (
      AvailabilityRules.doesEndTimeExceedCloseTime(config!, startTime, endTime)
    ) {
      await this.logAudit(userId, "APPOINTMENT_OUT_OF_HOURS", {
        startTime: data.startTime,
      });
      throw new DomainException("Horário fora do período de funcionamento.");
    }

    let appointment: Appointment;
    try {
      appointment = await this.appointmentRepo.createWithTransaction({
        userId,
        startTime,
        endTime,
        status: "PENDING",
        notes: data.notes,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "CONFLICT") {
        await this.logAudit(userId, "APPOINTMENT_CONFLICT", {
          startTime: data.startTime,
        });
        throw new ConflictException("O horário solicitado já está ocupado.");
      }
      throw error;
    }

    await this.logAudit(userId, "APPOINTMENT_SUCCESS", {
      appointmentId: appointment.id,
      startTime: appointment.startTime.toISOString(),
    });

    return this.mapToDTO(appointment);
  }

  private async logAudit(
    userId: string,
    eventType: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    try {
      await this.auditRepo.create({
        userId,
        eventType: eventType as any,
        payload,
      });
    } catch (error) {
      console.error("Failed to write audit log:", error);
    }
  }

  private mapToDTO(appointment: Appointment): AppointmentResponseDTO {
    return {
      id: appointment.id,
      userId: appointment.userId,
      startTime: appointment.startTime.toISOString(),
      endTime: appointment.endTime.toISOString(),
      status: appointment.status,
      notes: appointment.notes || null,
      createdAt: appointment.createdAt.toISOString(),
      updatedAt: appointment.updatedAt.toISOString(),
    };
  }
}
