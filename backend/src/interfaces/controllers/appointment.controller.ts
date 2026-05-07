import { FastifyReply, FastifyRequest } from "fastify";
import { CancelAppointmentUseCase } from "../../application/use-cases/appointment/CancelAppointmentUseCase";
import { ConfirmAppointmentUseCase } from "../../application/use-cases/appointment/ConfirmAppointmentUseCase";
import { CreateAppointmentUseCase } from "../../application/use-cases/appointment/CreateAppointmentUseCase";
import { ListAppointmentsUseCase } from "../../application/use-cases/appointment/ListAppointmentsUseCase";
import { UserRole } from "../../domain/value-objects/UserRole";
import { KnexAppointmentRepository } from "../../infrastructure/database/repositories/KnexAppointmentRepository";
import { KnexAuditLogRepository } from "../../infrastructure/database/repositories/KnexAuditLogRepository";
import { KnexAvailabilityRepository } from "../../infrastructure/database/repositories/KnexAvailabilityRepository";
import {
  CreateAppointmentInput,
  ListAppointmentsInput,
} from "../schemas/zod.schemas";

const appointmentRepo = new KnexAppointmentRepository();
const availabilityRepo = new KnexAvailabilityRepository();
const auditRepo = new KnexAuditLogRepository();

const createAppointmentUseCase = new CreateAppointmentUseCase(
  appointmentRepo,
  availabilityRepo,
  auditRepo,
);

const cancelAppointmentUseCase = new CancelAppointmentUseCase(
  appointmentRepo,
  auditRepo,
);

const listAppointmentsUseCase = new ListAppointmentsUseCase(appointmentRepo);

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = request.body as CreateAppointmentInput;
  const user = request.user!;

  const appointment = await createAppointmentUseCase.execute(
    {
      startTime: data.start_time,
      notes: data.notes,
    },
    user.id,
  );

  return reply.status(201).send({
    status: 201,
    code: "APPOINTMENT_CREATED",
    message: "Agendamento criado com sucesso.",
    data: appointment,
    timestamp: new Date().toISOString(),
  });
};

export const list = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = request.query as ListAppointmentsInput;
  const user = request.user!;

  const result = await listAppointmentsUseCase.execute(
    user.id,
    user.role as UserRole,
    {
      page: query.page,
      limit: query.limit,
    },
  );

  return reply.status(200).send({
    status: 200,
    code: "APPOINTMENTS_LISTED",
    message: "Agendamentos listados com sucesso.",
    data: result,
    timestamp: new Date().toISOString(),
  });
};

export const cancel = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;
  const user = request.user!;

  const appointment = await cancelAppointmentUseCase.execute(
    id,
    user.id,
    user.role as UserRole,
  );

  return reply.status(200).send({
    status: 200,
    code: "APPOINTMENT_CANCELLED",
    message: "Agendamento cancelado com sucesso.",
    data: appointment,
    timestamp: new Date().toISOString(),
  });
};

const confirmAppointmentUseCase = new ConfirmAppointmentUseCase(
  appointmentRepo,
  auditRepo
);

export const confirm = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const user = request.user!;

  if (user.role !== 'ADMIN') {
    return reply.status(403).send({
      status: 403,
      code: 'FORBIDDEN',
      message: 'Apenas administradores podem confirmar agendamentos.',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  const appointment = await confirmAppointmentUseCase.execute(id, user.id);

  return reply.status(200).send({
    status: 200,
    code: 'APPOINTMENT_CONFIRMED',
    message: 'Agendamento confirmado com sucesso.',
    data: appointment,
    timestamp: new Date().toISOString(),
  });
};
