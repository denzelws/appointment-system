import { InvalidStateException } from '../../../domain/errors/InvalidStateException';
import { NotFoundException } from '../../../domain/errors/NotFoundException';
import { IAppointmentRepository } from '../../../domain/interfaces/IAppointmentRepository';
import { IAuditLogRepository } from '../../../domain/interfaces/IAuditLogRepository';
import { AppointmentRules } from '../../../domain/rules/AppointmentRules';
import { AppointmentResponseDTO } from '../../dtos/AppointmentDTO';

export class ConfirmAppointmentUseCase {
  constructor(
    private appointmentRepo: IAppointmentRepository,
    private auditRepo: IAuditLogRepository
  ) {}

  async execute(appointmentId: string, adminId: string): Promise<AppointmentResponseDTO> {
    const appointment = await this.appointmentRepo.findById(appointmentId);

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado.');
    }

    if (!AppointmentRules.isValidTransition(appointment.status, 'CONFIRMED')) {
      throw new InvalidStateException(
        `Não é possível confirmar agendamento com status ${appointment.status}.`
      );
    }

    const confirmed = appointment.confirm();
    await this.appointmentRepo.update(confirmed);

    await this.logAudit(adminId, confirmed.id);

    return {
      id: confirmed.id,
      userId: confirmed.userId,
      startTime: confirmed.startTime.toISOString(),
      endTime: confirmed.endTime.toISOString(),
      status: confirmed.status,
      notes: confirmed.notes || null,
      createdAt: confirmed.createdAt.toISOString(),
      updatedAt: confirmed.updatedAt.toISOString(),
    };
  }

  private async logAudit(adminId: string, appointmentId: string): Promise<void> {
    try {
      await this.auditRepo.create({
        userId: adminId,
        eventType: 'APPOINTMENT_SUCCESS',
        appointmentId,
        payload: { action: 'CONFIRMED_BY_ADMIN' },
      });
    } catch (error) {
      console.error('Failed to write audit log:', error);
    }
  }
}