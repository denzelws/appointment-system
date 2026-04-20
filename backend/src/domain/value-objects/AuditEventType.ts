export type AuditEventType =
  | "APPOINTMENT_ATTEMPT"
  | "APPOINTMENT_SUCCESS"
  | "APPOINTMENT_CONFLICT"
  | "APPOINTMENT_PAST"
  | "APPOINTMENT_OUT_OF_HOURS"
  | "APPOINTMENT_CANCELLED"
  | "AUTH_LOGIN_SUCCESS"
  | "AUTH_LOGIN_FAILURE";

export const AuditEventType = {
  isValid(eventType: string): eventType is AuditEventType {
    const validTypes: AuditEventType[] = [
      "APPOINTMENT_ATTEMPT",
      "APPOINTMENT_SUCCESS",
      "APPOINTMENT_CONFLICT",
      "APPOINTMENT_PAST",
      "APPOINTMENT_OUT_OF_HOURS",
      "APPOINTMENT_CANCELLED",
      "AUTH_LOGIN_SUCCESS",
      "AUTH_LOGIN_FAILURE",
    ];
    return validTypes.includes(eventType as AuditEventType);
  },
} as const;
