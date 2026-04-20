import { describe, expect, it } from "vitest";
import { Appointment } from "../entities/Appointment";
import { User } from "../entities/User";

describe("User Entity", () => {
  it("should create user with correct properties", () => {
    const user = new User({
      id: "123",
      name: "João",
      email: "joao@email.com",
      passwordHash: "hash123",
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(user.name).toBe("João");
    expect(user.role).toBe("USER");
    expect(user.isAdmin()).toBe(false);
  });

  it("should identify admin user", () => {
    const admin = new User({
      id: "456",
      name: "Admin",
      email: "admin@email.com",
      passwordHash: "hash456",
      role: "ADMIN",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(admin.isAdmin()).toBe(true);
  });
});

describe("Appointment Entity", () => {
  it("should create appointment with correct status", () => {
    const apt = new Appointment({
      id: "789",
      userId: "123",
      startTime: new Date("2026-04-20T10:00:00Z"),
      endTime: new Date("2026-04-20T10:30:00Z"),
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(apt.isActive()).toBe(true);
    expect(apt.isPending()).toBe(true);
    expect(apt.isCancelled()).toBe(false);
  });
});
