import { describe, expect, it } from "vitest";
import { AvailabilityConfig } from "../entities/AvailabilityConfig";
import { AvailabilityRules } from "../rules/AvailabilityRules";

const makeConfig = (
  overrides?: Partial<AvailabilityConfig>,
): AvailabilityConfig =>
  new AvailabilityConfig({
    id: "1",
    dayOfWeek: 1,
    openTime: "09:00",
    closeTime: "18:00",
    slotDurationMinutes: 30,
    isActive: true,
    ...overrides,
  });

describe("RN004 — Restrição de horário de funcionamento", () => {
  it("deve aceitar horário dentro do funcionamento", () => {
    const config = makeConfig();
    const result = AvailabilityRules.isWithinBusinessHours(
      config,
      new Date("2026-05-11T13:00:00Z"),
      new Date("2026-05-11T13:30:00Z"),
    );
    expect(result).toBe(true);
  });

  it("deve rejeitar horário antes da abertura", () => {
    const config = makeConfig();
    const result = AvailabilityRules.isWithinBusinessHours(
      config,
      new Date("2026-05-11T11:00:00Z"),
      new Date("2026-05-11T11:30:00Z"),
    );
    expect(result).toBe(false);
  });

  it("deve rejeitar horário após o encerramento", () => {
    const config = makeConfig();
    const result = AvailabilityRules.isWithinBusinessHours(
      config,
      new Date("2026-05-11T21:00:00Z"),
      new Date("2026-05-11T21:30:00Z"),
    );
    expect(result).toBe(false);
  });

  it("deve rejeitar quando o dia está inativo", () => {
    const config = makeConfig({ isActive: false });
    const result = AvailabilityRules.isWithinBusinessHours(
      config,
      new Date("2026-05-11T13:00:00Z"),
      new Date("2026-05-11T13:30:00Z"),
    );
    expect(result).toBe(false);
  });

  it("deve rejeitar dia inativo via isDayActive", () => {
    const config = makeConfig({ isActive: false });
    expect(AvailabilityRules.isDayActive(config)).toBe(false);
  });

  it("deve aceitar dia ativo via isDayActive", () => {
    const config = makeConfig({ isActive: true });
    expect(AvailabilityRules.isDayActive(config)).toBe(true);
  });

  it("deve retornar false quando config é null", () => {
    expect(AvailabilityRules.isDayActive(null)).toBe(false);
  });
});
