import {
  CreateAuditLogData,
  IAuditLogRepository,
} from "../../../domain/interfaces/IAuditLogRepository";
import { db } from "../index";

export class KnexAuditLogRepository implements IAuditLogRepository {
  async create(data: CreateAuditLogData): Promise<void> {
    await db("audit_logs").insert({
      user_id: data.userId || null,
      event_type: data.eventType,
      appointment_id: data.appointmentId || null,
      payload: JSON.stringify(data.payload),
    });
  }
}
