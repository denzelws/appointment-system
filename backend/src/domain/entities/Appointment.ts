import { AppointmentStatus } from "../value-objects/AppointmentStatus";

export interface AppointmentProps {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Appointment {
  private readonly props: AppointmentProps;

  constructor(props: AppointmentProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get startTime(): Date {
    return this.props.startTime;
  }

  get endTime(): Date {
    return this.props.endTime;
  }

  get status(): AppointmentStatus {
    return this.props.status;
  }

  get notes(): string | undefined {
    return this.props.notes;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isActive(): boolean {
    return this.props.status !== "CANCELLED";
  }

  isPending(): boolean {
    return this.props.status === "PENDING";
  }

  isConfirmed(): boolean {
    return this.props.status === "CONFIRMED";
  }

  isCancelled(): boolean {
    return this.props.status === "CANCELLED";
  }

  toPlain(): AppointmentProps {
    return { ...this.props };
  }
}
