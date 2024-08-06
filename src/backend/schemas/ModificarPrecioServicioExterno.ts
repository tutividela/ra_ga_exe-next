import { z } from "zod";

export const ModificarPrecioServicioExternoSchema = z.object({
  id: z.string(),
  factorMultiplicador: z.number().nonnegative(),
});

export type ModificarPrecioServicioExternoSchemaType = z.infer<
  typeof ModificarPrecioServicioExternoSchema
>;
