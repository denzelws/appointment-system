export type UserRole = "USER" | "ADMIN";

export const UserRole = {
  isValid(role: string): role is UserRole {
    return role === "USER" || role === "ADMIN";
  },
} as const;
