import { z } from "zod";

export const ProcesoDisenioSchema = z.object({
  id: z.string().optional(),
  idProcesoDesarrollo: z.string(),
  comentario: z.string(),
});

export type ProcesoDisenioType = z.infer<typeof ProcesoDisenioSchema>;
