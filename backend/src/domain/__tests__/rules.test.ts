import { describe, expect, it } from "vitest";
import { Appointment } from "../entities/Appointment";
import { AvailabilityConfig } from "../entities/AvailabilityConfig";
import { AppointmentRules } from "../rules/AppointmentRules";
import { AvailabilityRules } from "../rules/AvailabilityRules";

describe("AppointmentRules", () => {
  describe("isNotInPast", () => {
    it("should reject appointment in the past", () => {
      const past = new Date(Date.now() - 60 * 60 * 1000);
      expect(AppointmentRules.isNotInPast(past)).toBe(false);
    });

    it("should accept appointment 1 minute in the future", () => {
      const future = new Date(Date.now() + 2 + 60 * 1000);
      expect(AppointmentRules.isNotInPast(future)).toBe(true);
    });
  });

  describe("hasConflict", () => {
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

      const overlaps = AppointmentRules.hasConflict(
        [existing],
        new Date("2026-04-20T10:15:00Z"),
        new Date("2026-04-20T10:45:00Z"),
      );

      expect(overlaps).toBe(true);
    });

    it("should not detect conflict with cancelled appointment", () => {
      const cancelled = new Appointment({
        id: "1",
        userId: "user1",
        startTime: new Date("2026-04-20T10:00:00Z"),
        endTime: new Date("2026-04-20T10:30:00Z"),
        status: "CANCELLED",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const overlaps = AppointmentRules.hasConflict(
        [cancelled],
        new Date("2026-04-20T10:00:00Z"),
        new Date("2026-04-20T10:30:00Z"),
      );

      expect(overlaps).toBe(false);
    });
  });

  describe("calculateEndTime", () => {
    it("should add duration to start time", () => {
      const start = new Date("2026-04-20T10:00:00Z");
      const end = AppointmentRules.calculateEndTime(start, 30);
      expect(end.toISOString()).toBe("2026-04-20T10:30:00.000Z");
    });
  });

  describe("isValidTransition", () => {
    it("should allow PENDING → CONFIRMED", () => {
      expect(AppointmentRules.isValidTransition("PENDING", "CONFIRMED")).toBe(
        true,
      );
    });

    it("should allow PENDING → CANCELLED", () => {
      expect(AppointmentRules.isValidTransition("PENDING", "CANCELLED")).toBe(
        true,
      );
    });

    it("should not allow CONFIRMED → PENDING", () => {
      expect(AppointmentRules.isValidTransition("CONFIRMED", "PENDING")).toBe(
        false,
      );
    });
  });
});

describe("AvailabilityRules", () => {
  describe("isWithinBusinessHours", () => {
    it("should accept time within business hours", () => {
      const config = new AvailabilityConfig({
        id: "1",
        dayOfWeek: 1,
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
        dayOfWeek: 1,
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

    it("should reject when day is inactive", () => {
      const config = new AvailabilityConfig({
        id: "1",
        dayOfWeek: 0,
        openTime: "09:00",
        closeTime: "18:00",
        slotDurationMinutes: 30,
        isActive: false,
      });

      const result = AvailabilityRules.isWithinBusinessHours(
        config,
        new Date("2026-04-19T10:00:00Z"),
        new Date("2026-04-19T10:30:00Z"),
      );

      expect(result).toBe(false);
    });
  });
});
