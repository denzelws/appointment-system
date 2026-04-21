import { DomainException } from "./DomainException";

export class InvalidStateException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = "InvalidStateException";
  }
}
