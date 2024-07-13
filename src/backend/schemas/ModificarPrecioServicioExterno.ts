import { z } from "zod";

export const ModificarPrecioServicioExternoSchema = z.object({
  id: z.string(),
  factorMultiplicador: z
    .number()
    .min(1, { message: "Se requiere un factor multiplicador" }),
});

export type ModificarPrecioServicioExternoSchemaType = z.infer<
  typeof ModificarPrecioServicioExternoSchema
>;
