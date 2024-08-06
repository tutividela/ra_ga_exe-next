import { z } from "zod";

export const ProcesoDigitalizacionSchema = z.object({
  id: z.string().optional(),
  idProcesoDesarrolloOrden: z.string(),
  cantidadDeMoldes: z.number().nonnegative(),
  cantidadDeAviosConMedida: z.number().nonnegative(),
  cantidadDeTalles: z.number().nonnegative(),
  cantidadDeMateriales: z.number().nonnegative(),
});

export type ProcesoDigitalizacionType = z.infer<
  typeof ProcesoDigitalizacionSchema
>;
