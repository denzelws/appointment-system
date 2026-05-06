import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
});

export const createAppointmentSchema = z.object({
  start_time: z
    .string()
    .min(1, 'Data é obrigatória')
    .refine((val) => {
      const date = new Date(val);
      return date > new Date();
    }, 'A data deve ser futura'),
  notes: z
    .string()
    .max(500, 'Máximo 500 caracteres')
    .optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;