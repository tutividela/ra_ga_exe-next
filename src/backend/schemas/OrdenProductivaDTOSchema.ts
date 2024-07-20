import { z } from "zod";

export const OrdenProductivaDTOSchema = z.object({
  idOrden: z.string(),
  cantidad: z.number(),
  precioEstimado: z.number(),
});

export type OrdenProductivaSchemaDTOType = z.infer<
  typeof OrdenProductivaDTOSchema
>;
