import { DomainException } from "./DomainException";

export class NotFoundException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundException";
  }
}
