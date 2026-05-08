import { describe, expect, it } from "vitest";
import { AppointmentRules } from "../rules/AppointmentRules";

describe("RN003 — Proibição de agendamento no passado", () => {
  it("deve rejeitar start_time anterior ao momento atual", () => {
    const passado = new Date(Date.now() - 60 * 60 * 1000);
    expect(AppointmentRules.isNotInPast(passado)).toBe(false);
  });

  it("deve rejeitar start_time no exato momento atual", () => {
    const agora = new Date();
    expect(AppointmentRules.isNotInPast(agora)).toBe(false);
  });

  it("deve aceitar start_time futuro além da tolerância", () => {
    const futuro = new Date(Date.now() + 2 * 60 * 1000);
    expect(AppointmentRules.isNotInPast(futuro)).toBe(true);
  });

  it("deve aceitar start_time com 24h de antecedência", () => {
    const amanha = new Date(Date.now() + 24 * 60 * 60 * 1000);
    expect(AppointmentRules.isNotInPast(amanha)).toBe(true);
  });
});
