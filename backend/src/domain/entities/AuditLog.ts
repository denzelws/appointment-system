import { AuditEventType } from "../value-objects/AuditEventType";

export interface AuditLogProps {
  id: string;
  userId?: string;
  eventType: AuditEventType;
  appointmentId?: string;
  payload: Record<string, unknown>;
  createdAt: Date;
}

export class AuditLog {
  private readonly props: AuditLogProps;

  constructor(props: AuditLogProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string | undefined {
    return this.props.userId;
  }

  get eventType(): AuditEventType {
    return this.props.eventType;
  }

  get appointmentId(): string | undefined {
    return this.props.appointmentId;
  }

  get payload(): Record<string, unknown> {
    return this.props.payload;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
