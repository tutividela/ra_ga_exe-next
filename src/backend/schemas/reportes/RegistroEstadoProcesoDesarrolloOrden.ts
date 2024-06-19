import { z } from "zod";

export const RegistroEstadoProcesoDesarrolloOrdenSchema = z.object({
  idEstadoProcesoDesarrolloOrden: z.number(),
  idUsuario: z.string(),
});

export type RegistroEstadoProcesoDesarrolloOrdenSchemaType = z.infer<
  typeof RegistroEstadoProcesoDesarrolloOrdenSchema
>;
