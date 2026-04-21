import { Appointment } from "../entities/Appointment";
import { AppointmentStatus } from "../value-objects/AppointmentStatus";

export interface CreateAppointmentData {
  userId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  notes?: string;
}

export interface FindManyOptions {
  userId?: string;
  status?: AppointmentStatus;
  startDate?: Date;
  endDate?: Date;
  page: number;
  limit: number;
  offset: number;
}

export interface FindManyResult {
  appointments: Appointment[];
  total: number;
}

export interface IAppointmentRepository {
  findById(id: string): Promise<Appointment | null>;
  findMany(options: FindManyOptions): Promise<FindManyResult>;
  findOverlapping(startTime: Date, endTime: Date): Promise<Appointment[]>;
  createWithTransaction(data: CreateAppointmentData): Promise<Appointment>;
  update(appointment: Appointment): Promise<Appointment>;
}
