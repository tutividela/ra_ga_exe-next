import { z } from "zod";

export const ProcesoDigitalizacionSchema = z.object({
  id: z.string().optional(),
  idProcesoDesarrolloOrden: z.string(),
  cantidadDeMoldes: z.number(),
  cantidadDeAviosConMedida: z.number(),
  cantidadDeTalles: z.number(),
  cantidadDeMateriales: z.number(),
});

export type ProcesoDigitalizacionType = z.infer<
  typeof ProcesoDigitalizacionSchema
>;
