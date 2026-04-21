import { DomainException } from "./DomainException";

export class UnauthorizedException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedException";
  }
}
