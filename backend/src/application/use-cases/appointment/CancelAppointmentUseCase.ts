import { DomainException } from "../../../domain/errors/DomainException";
import { ForbiddenException } from "../../../domain/errors/ForbiddenException";
import { NotFoundException } from "../../../domain/errors/NotFoundException";
import { IAppointmentRepository } from "../../../domain/interfaces/IAppointmentRepository";
import { IAuditLogRepository } from "../../../domain/interfaces/IAuditLogRepository";
import { AppointmentRules } from "../../../domain/rules/AppointmentRules";
import { UserRole } from "../../../domain/value-objects/UserRole";
import { AppointmentResponseDTO } from "../../dtos/AppointmentDTO";

export class CancelAppointmentUseCase {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private auditRepo: IAuditLogRepository,
  ) {}

  async execute(
    appointmentId: string,
    userId: string,
    userRole: UserRole,
  ): Promise<AppointmentResponseDTO> {
    const appointment = await this.appointmentRepo.findById(appointmentId);

    if (!appointment) {
      throw new NotFoundException("Agendamento não encontrado.");
    }

    if (userRole === "USER" && appointment.userId !== userId) {
      throw new ForbiddenException(
        "Você não tem permissão para cancelar este agendamento.",
      );
    }

    if (!AppointmentRules.canCancel(appointment)) {
      if (appointment.isCancelled()) {
        throw new DomainException("Agendamento já cancelado.");
      }
      throw new DomainException("Não é possível cancelar este agendamento.");
    }

    const cancelled = appointment.cancel();
    await this.appointmentRepo.update(cancelled);

    await this.logAudit(userId, "APPOINTMENT_CANCELLED", {
      appointmentId: cancelled.id,
      previousStatus: appointment.status,
    });

    return {
      id: cancelled.id,
      userId: cancelled.userId,
      startTime: cancelled.startTime.toISOString(),
      endTime: cancelled.endTime.toISOString(),
      status: cancelled.status,
      notes: cancelled.notes || null,
      createdAt: cancelled.createdAt.toISOString(),
      updatedAt: cancelled.updatedAt.toISOString(),
    };
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
}
