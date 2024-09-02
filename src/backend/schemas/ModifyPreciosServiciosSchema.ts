import { z } from "zod";

export const ModifyPreciosServiciosSchema = z.object({
  id: z.string(),
  precioBase: z.number().nonnegative({ message: "Precio base no puede ser negativo" }),
  factorMultiplicador: z
    .number().nonnegative({ message: "Factor multiplicador no puede ser negativo" }),
}).refine((preciosServicioSchema) => preciosServicioSchema.factorMultiplicador !== 0 || preciosServicioSchema.precioBase !== 0, {
  message: "Precio base y factor multiplicador no pueden ser ambos 0"
});

export type ModifyPreciosServiciosSchemaType = z.infer<
  typeof ModifyPreciosServiciosSchema
>;
