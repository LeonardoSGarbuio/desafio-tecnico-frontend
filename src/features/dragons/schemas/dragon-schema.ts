import { z } from "zod";

export const dragonSchema = z.object({
  name: z
    .string()
    .min(1, "O nome do dragão é obrigatório")
    .min(2, "O nome deve conter pelo menos 2 caracteres")
    .max(50, "O nome não pode exceder 50 caracteres"),
  type: z
    .string()
    .min(1, "O tipo/elemento do dragão é obrigatório")
    .min(2, "O tipo deve conter pelo menos 2 caracteres")
    .max(50, "O tipo não pode exceder 50 caracteres"),
  histories: z
    .string()
    .optional()
    .transform((val) => val ?? ""),
});

export type DragonFormValues = z.infer<typeof dragonSchema>;
