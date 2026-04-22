import { describe, expect, it } from "vitest";
import { Appointment } from "../../domain/entities/Appointment";
import { AvailabilityConfig } from "../../domain/entities/AvailabilityConfig";
import { AppointmentRules } from "../../domain/rules/AppointmentRules";
import { AvailabilityRules } from "../../domain/rules/AvailabilityRules";
import { DayOfWeek } from "../../domain/value-objects/DayOfWeek";

describe("CreateAppointmentUseCase - Business Rules", () => {
  describe("Past appointment rejection", () => {
    it("should reject appointment in the past", () => {
      const pastDate = new Date(Date.now() - 60 * 60 * 1000);
      expect(AppointmentRules.isNotInPast(pastDate)).toBe(false);
    });

    it("should accept future appointment", () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      expect(AppointmentRules.isNotInPast(futureDate)).toBe(true);
    });
  });

  describe("Conflict detection", () => {
    it("should detect overlapping appointments", () => {
      const existing = new Appointment({
        id: "1",
        userId: "user1",
        startTime: new Date("2026-04-20T10:00:00Z"),
        endTime: new Date("2026-04-20T10:30:00Z"),
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const hasConflict = AppointmentRules.hasConflict(
        [existing],
        new Date("2026-04-20T10:15:00Z"),
        new Date("2026-04-20T10:45:00Z"),
      );

      expect(hasConflict).toBe(true);
    });

    it("should not conflict with cancelled appointment", () => {
      const cancelled = new Appointment({
        id: "1",
        userId: "user1",
        startTime: new Date("2026-04-20T10:00:00Z"),
        endTime: new Date("2026-04-20T10:30:00Z"),
        status: "CANCELLED",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const hasConflict = AppointmentRules.hasConflict(
        [cancelled],
        new Date("2026-04-20T10:00:00Z"),
        new Date("2026-04-20T10:30:00Z"),
      );

      expect(hasConflict).toBe(false);
    });
  });

  describe("Business hours validation", () => {
    it("should accept time within business hours", () => {
      const config = new AvailabilityConfig({
        id: "1",
        dayOfWeek: 1 as DayOfWeek,
        openTime: "09:00",
        closeTime: "18:00",
        slotDurationMinutes: 30,
        isActive: true,
      });

      const result = AvailabilityRules.isWithinBusinessHours(
        config,
        new Date("2026-04-20T10:00:00Z"),
        new Date("2026-04-20T10:30:00Z"),
      );

      expect(result).toBe(true);
    });

    it("should reject time outside business hours", () => {
      const config = new AvailabilityConfig({
        id: "1",
        dayOfWeek: 1 as DayOfWeek,
        openTime: "09:00",
        closeTime: "18:00",
        slotDurationMinutes: 30,
        isActive: true,
      });

      const result = AvailabilityRules.isWithinBusinessHours(
        config,
        new Date("2026-04-20T19:00:00Z"),
        new Date("2026-04-20T19:30:00Z"),
      );

      expect(result).toBe(false);
    });

    it("should reject inactive day", () => {
      const config = new AvailabilityConfig({
        id: "1",
        dayOfWeek: 0 as DayOfWeek,
        openTime: "09:00",
        closeTime: "18:00",
        slotDurationMinutes: 30,
        isActive: false,
      });

      const result = AvailabilityRules.isDayActive(config);
      expect(result).toBe(false);
    });
  });

  describe("End time calculation", () => {
    it("should calculate correct end time", () => {
      const start = new Date("2026-04-20T10:00:00Z");
      const end = AppointmentRules.calculateEndTime(start, 30);
      expect(end.toISOString()).toBe("2026-04-20T10:30:00.000Z");
    });
  });
});
