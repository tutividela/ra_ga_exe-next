import { z } from "zod";

export const CargaDeTiempoSchema = z.object({
    horas: z.number().min(0, { message: "Las horas no pueden ser negativas" }).max(24, { message: "Las horas no pueden ser mayor a 24" }),
    minutos: z.number().min(0, { message: "Las horas no pueden ser negativas" }).max(59, { message: "Las horas no pueden ser mayor a 60" }),
    comentario: z.string()
});

export type CargaDeTiempoType = z.infer<typeof CargaDeTiempoSchema>;