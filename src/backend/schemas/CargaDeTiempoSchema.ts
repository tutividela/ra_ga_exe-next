import { z } from "zod";

export const CargaDeTiempoSchema = z
  .object({
    horas: z
      .number()
      .min(0, { message: "Las horas no pueden ser negativas" })
      .max(23, { message: "Las horas no pueden ser mayor a 24" }),
    minutos: z
      .number()
      .min(0, { message: "Las horas no pueden ser negativas" })
      .max(59, { message: "Las horas no pueden ser mayor a 60" }),
    comentario: z.string(),
    idUsuario: z.string(),
    idProcesoDesarrolloOrden: z.string().optional(),
  })
  .refine(
    (cargaDeTiempo) =>
      !(cargaDeTiempo.horas === 0 && cargaDeTiempo.minutos === 0),
    "No se puede cargar horas y minutos con 0"
  );

export type CargaDeTiempoType = z.infer<typeof CargaDeTiempoSchema>;
