import { DayOfWeek } from "../value-objects/DayOfWeek";

export interface AvailabilityConfigProps {
  id: string;
  dayOfWeek: DayOfWeek;
  openTime: string;
  closeTime: string;
  slotDurationMinutes: number;
  isActive: boolean;
}

export class AvailabilityConfig {
  private readonly props: AvailabilityConfigProps;

  constructor(props: AvailabilityConfigProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get dayOfWeek(): DayOfWeek {
    return this.props.dayOfWeek;
  }

  get openTime(): string {
    return this.props.openTime;
  }

  get closeTime(): string {
    return this.props.closeTime;
  }

  get slotDurationMinutes(): number {
    return this.props.slotDurationMinutes;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }
}
