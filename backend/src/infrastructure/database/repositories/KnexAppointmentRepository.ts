import { Appointment } from "../../../domain/entities/Appointment";
import {
  CreateAppointmentData,
  FindManyOptions,
  FindManyResult,
  IAppointmentRepository,
} from "../../../domain/interfaces/IAppointmentRepository";
import { AppointmentStatus } from "../../../domain/value-objects/AppointmentStatus";
import { db } from "../index";

interface AppointmentRow {
  id: string;
  user_id: string;
  start_time: Date;
  end_time: Date;
  status: AppointmentStatus;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export class KnexAppointmentRepository implements IAppointmentRepository {
  async findById(id: string): Promise<Appointment | null> {
    const row = await db("appointments").where({ id }).first();
    if (!row) return null;
    return this.mapRowToEntity(row as AppointmentRow);
  }

  async findMany(options: FindManyOptions): Promise<FindManyResult> {
    let query = db("appointments");

    if (options.userId) {
      query = query.where({ user_id: options.userId });
    }

    if (options.status) {
      query = query.where({ status: options.status });
    }

    if (options.startDate) {
      query = query.where("start_time", ">=", options.startDate);
    }

    if (options.endDate) {
      query = query.where("start_time", "<=", options.endDate);
    }

    const totalResult = await query.clone().count("id as count").first();
    const total = Number(totalResult?.count || 0);

    const rows = await query
      .orderBy("start_time", "asc")
      .limit(options.limit)
      .offset(options.offset)
      .select("*");

    return {
      appointments: (rows as AppointmentRow[]).map((row) =>
        this.mapRowToEntity(row),
      ),
      total,
    };
  }

  async findOverlapping(
    startTime: Date,
    endTime: Date,
  ): Promise<Appointment[]> {
    const rows = await db("appointments")
      .whereNotIn("status", ["CANCELLED"])
      .whereRaw("tstzrange(?, ?) && tstzrange(start_time, end_time)", [
        startTime.toISOString(),
        endTime.toISOString(),
      ])
      .select("*");

    return (rows as AppointmentRow[]).map((row) => this.mapRowToEntity(row));
  }

  async createWithTransaction(
    data: CreateAppointmentData,
  ): Promise<Appointment> {
    return db.transaction(async (trx) => {
      const overlapping = await trx("appointments")
        .whereNotIn("status", ["CANCELLED"])
        .whereRaw("tstzrange(?, ?) && tstzrange(start_time, end_time)", [
          data.startTime.toISOString(),
          data.endTime.toISOString(),
        ])
        .select("*");

      if (overlapping.length > 0) {
        throw new Error("CONFLICT");
      }

      const [row] = await trx("appointments")
        .insert({
          user_id: data.userId,
          start_time: data.startTime,
          end_time: data.endTime,
          status: data.status,
          notes: data.notes || null,
        })
        .returning("*");

      return this.mapRowToEntity(row as AppointmentRow);
    });
  }

  async update(appointment: Appointment): Promise<Appointment> {
    const [row] = await db("appointments")
      .where({ id: appointment.id })
      .update({
        status: appointment.status,
        notes: appointment.notes || null,
        updated_at: new Date(),
      })
      .returning("*");

    return this.mapRowToEntity(row as AppointmentRow);
  }

  private mapRowToEntity(row: AppointmentRow): Appointment {
    return new Appointment({
      id: row.id,
      userId: row.user_id,
      startTime: new Date(row.start_time),
      endTime: new Date(row.end_time),
      status: row.status,
      notes: row.notes || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }
}
