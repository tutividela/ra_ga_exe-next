import { z } from "zod";

export const ProcessUpdateSchema = z.object({
  id: z.string(),
  estado: z.string(),
  icon: z.string(),
  proceso: z.string(),
  esDeProduccion: z.boolean(),
  estimatedAt: z.string(),
});

export type ProcessUpdateSchemaType = z.infer<typeof ProcessUpdateSchema>;
