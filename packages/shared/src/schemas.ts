import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(72),
});

export const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export const SubmitAnswerSchema = z.object({
  answer: z.string().trim().min(1).max(5000),
});

export const IdParamSchema = z.object({
  id: z.string().uuid(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type SubmitAnswerInput = z.infer<typeof SubmitAnswerSchema>;
