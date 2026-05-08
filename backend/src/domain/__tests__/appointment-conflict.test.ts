import { describe, expect, it } from "vitest";
import { Appointment } from "../entities/Appointment";
import { AppointmentRules } from "../rules/AppointmentRules";

const makeAppointment = (
  start: string,
  end: string,
  status: "PENDING" | "CONFIRMED" | "CANCELLED" = "PENDING",
): Appointment =>
  new Appointment({
    id: crypto.randomUUID(),
    userId: "user-1",
    startTime: new Date(start),
    endTime: new Date(end),
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

describe("RN005 — Proibição de conflito de horário", () => {
  it("deve detectar sobreposição quando novo início está dentro do existente", () => {
    const existente = makeAppointment(
      "2026-05-10T10:00:00Z",
      "2026-05-10T10:30:00Z",
    );

    const conflito = AppointmentRules.hasConflict(
      [existente],
      new Date("2026-05-10T10:15:00Z"),
      new Date("2026-05-10T10:45:00Z"),
    );

    expect(conflito).toBe(true);
  });

  it("deve detectar sobreposição quando novo fim está dentro do existente", () => {
    const existente = makeAppointment(
      "2026-05-10T10:00:00Z",
      "2026-05-10T10:30:00Z",
    );

    const conflito = AppointmentRules.hasConflict(
      [existente],
      new Date("2026-05-10T09:45:00Z"),
      new Date("2026-05-10T10:15:00Z"),
    );

    expect(conflito).toBe(true);
  });

  it("deve detectar sobreposição quando novo engloba o existente", () => {
    const existente = makeAppointment(
      "2026-05-10T10:00:00Z",
      "2026-05-10T10:30:00Z",
    );

    const conflito = AppointmentRules.hasConflict(
      [existente],
      new Date("2026-05-10T09:00:00Z"),
      new Date("2026-05-10T11:00:00Z"),
    );

    expect(conflito).toBe(true);
  });

  it("deve detectar sobreposição quando horários são idênticos", () => {
    const existente = makeAppointment(
      "2026-05-10T10:00:00Z",
      "2026-05-10T10:30:00Z",
    );

    const conflito = AppointmentRules.hasConflict(
      [existente],
      new Date("2026-05-10T10:00:00Z"),
      new Date("2026-05-10T10:30:00Z"),
    );

    expect(conflito).toBe(true);
  });

  it("não deve detectar conflito com agendamento adjacente (início = fim do existente)", () => {
    const existente = makeAppointment(
      "2026-05-10T10:00:00Z",
      "2026-05-10T10:30:00Z",
    );

    const conflito = AppointmentRules.hasConflict(
      [existente],
      new Date("2026-05-10T10:30:00Z"),
      new Date("2026-05-10T11:00:00Z"),
    );

    expect(conflito).toBe(false);
  });

  it("não deve detectar conflito com horário completamente diferente", () => {
    const existente = makeAppointment(
      "2026-05-10T10:00:00Z",
      "2026-05-10T10:30:00Z",
    );

    const conflito = AppointmentRules.hasConflict(
      [existente],
      new Date("2026-05-10T14:00:00Z"),
      new Date("2026-05-10T14:30:00Z"),
    );

    expect(conflito).toBe(false);
  });

  it("não deve detectar conflito com agendamento CANCELADO no mesmo horário", () => {
    const cancelado = makeAppointment(
      "2026-05-10T10:00:00Z",
      "2026-05-10T10:30:00Z",
      "CANCELLED",
    );

    const conflito = AppointmentRules.hasConflict(
      [cancelado],
      new Date("2026-05-10T10:00:00Z"),
      new Date("2026-05-10T10:30:00Z"),
    );

    expect(conflito).toBe(false);
  });

  it("deve detectar conflito com múltiplos agendamentos quando um deles conflita", () => {
    const agendamentos = [
      makeAppointment("2026-05-10T09:00:00Z", "2026-05-10T09:30:00Z"),
      makeAppointment("2026-05-10T10:00:00Z", "2026-05-10T10:30:00Z"),
      makeAppointment("2026-05-10T11:00:00Z", "2026-05-10T11:30:00Z"),
    ];

    const conflito = AppointmentRules.hasConflict(
      agendamentos,
      new Date("2026-05-10T10:15:00Z"),
      new Date("2026-05-10T10:45:00Z"),
    );

    expect(conflito).toBe(true);
  });
});
