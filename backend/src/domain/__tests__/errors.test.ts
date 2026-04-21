import { describe, expect, it } from "vitest";
import { ConflictException } from "../errors/ConflictException";
import { DomainException } from "../errors/DomainException";
import { NotFoundException } from "../errors/NotFoundException";

describe("Domain Exceptions", () => {
  it("should create DomainException with message", () => {
    const error = new DomainException("Algo deu errado");
    expect(error.message).toBe("Algo deu errado");
    expect(error.name).toBe("DomainException");
  });

  it("should create ConflictException", () => {
    const error = new ConflictException("Conflito de horário");
    expect(error.name).toBe("ConflictException");
    expect(error).toBeInstanceOf(DomainException);
  });

  it("should create NotFoundException", () => {
    const error = new NotFoundException("Agendamento não encontrado");
    expect(error.name).toBe("NotFoundException");
    expect(error).toBeInstanceOf(DomainException);
  });
});
