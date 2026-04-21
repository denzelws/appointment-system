import { AuditEventType } from "../value-objects/AuditEventType";

export interface CreateAuditLogData {
  userId?: string;
  eventType: AuditEventType;
  appointmentId?: string;
  payload: Record<string, unknown>;
}

export interface IAuditLogRepository {
  create(data: CreateAuditLogData): Promise<void>;
}
