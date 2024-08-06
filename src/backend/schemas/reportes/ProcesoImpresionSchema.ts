import { z } from "zod";

export const ProcesoImpresionSchema = z.object({
  id: z.string().optional(),
  idProcesoDesarrolloOrden: z.string(),
  cantidadDeMetros: z.number().nonnegative(),
});

export type ProcesoImpresionSchemaType = z.infer<typeof ProcesoImpresionSchema>;
