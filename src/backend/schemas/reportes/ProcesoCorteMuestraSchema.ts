import { z } from "zod";

export const ProcesoCorteSchema = z.object({
  id: z.string().optional(),
  idProcesoDesarrolloOrden: z.string(),
  nombre: z.string(),
  cantidad: z.number(),
  esAvio: z.boolean().default(false),
  tipoDeAvio: z.string().default(""),
});

export type ProcesoCorteMuestraSchemaType = z.infer<typeof ProcesoCorteSchema>;
