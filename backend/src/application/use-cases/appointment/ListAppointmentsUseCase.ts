import { IAppointmentRepository } from "../../../domain/interfaces/IAppointmentRepository";
import { UserRole } from "../../../domain/value-objects/UserRole";
import {
  ListAppointmentsDTO,
  ListAppointmentsResponseDTO,
} from "../../dtos/AppointmentDTO";

export class ListAppointmentsUseCase {
  constructor(private appointmentRepo: IAppointmentRepository) {}

  async execute(
    userId: string,
    userRole: UserRole,
    params?: ListAppointmentsDTO,
  ): Promise<ListAppointmentsResponseDTO> {
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const offset = (page - 1) * limit;

    const filterUserId = userRole === "ADMIN" ? undefined : userId;

    const { appointments, total } = await this.appointmentRepo.findMany({
      userId: filterUserId,
      page,
      limit,
      offset,
    });

    return {
      appointments: appointments.map((apt) => ({
        id: apt.id,
        userId: apt.userId,
        startTime: apt.startTime.toISOString(),
        endTime: apt.endTime.toISOString(),
        status: apt.status,
        notes: apt.notes || null,
        createdAt: apt.createdAt.toISOString(),
        updatedAt: apt.updatedAt.toISOString(),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
