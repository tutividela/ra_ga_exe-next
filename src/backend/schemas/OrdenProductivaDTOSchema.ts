import { z } from "zod";

export const OrdenProductivaDTOSchema = z.object({
  idOrden: z.string(),
  cantidad: z.number().max(9999),
  precioEstimado: z.number(),
  usuario: z.object({ nombre: z.string(), email: z.string() }),
});

export type OrdenProductivaSchemaDTOType = z.infer<
  typeof OrdenProductivaDTOSchema
>;
