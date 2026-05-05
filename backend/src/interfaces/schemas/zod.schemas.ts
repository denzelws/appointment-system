import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const registerSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const createAppointmentSchema = z.object({
  start_time: z.string().datetime("Data deve estar em formato ISO 8601"),
  notes: z.string().max(500, "Máximo 500 caracteres").optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid("ID deve ser um UUID válido"),
});

export const listAppointmentsSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type ListAppointmentsInput = z.infer<typeof listAppointmentsSchema>;

export const registerJsonSchema = zodToJsonSchema(registerSchema);
export const loginJsonSchema = zodToJsonSchema(loginSchema);
export const createAppointmentJsonSchema = zodToJsonSchema(
  createAppointmentSchema,
);
export const idParamJsonSchema = zodToJsonSchema(idParamSchema);
export const listAppointmentsJsonSchema = zodToJsonSchema(
  listAppointmentsSchema,
);
