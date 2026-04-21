import { DomainException } from "./DomainException";

export class ConflictException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = "ConflictException";
  }
}
