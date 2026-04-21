import { describe, expect, it } from "vitest";
import { Appointment } from "../../domain/entities/Appointment";
import { AppointmentRules } from "../../domain/rules/AppointmentRules";
import { JwtService } from "../services";

describe("AppointmentRules - Conflict Detection", () => {
  it("should detect overlap correctly", () => {
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

  it("should not detect overlap with cancelled", () => {
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

describe("JwtService", () => {
  it("should generate and verify token", () => {
    const payload = { userId: "123", email: "test@test.com", role: "USER" };
    const token = JwtService.generateToken(payload);
    const decoded = JwtService.verifyToken(token);

    expect(decoded.userId).toBe("123");
    expect(decoded.email).toBe("test@test.com");
    expect(decoded.role).toBe("USER");
  });
});
