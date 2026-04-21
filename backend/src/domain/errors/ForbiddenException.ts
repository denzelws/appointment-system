import { DomainException } from "./DomainException";

export class ForbiddenException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenException";
  }
}
