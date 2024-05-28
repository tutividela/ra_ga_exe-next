import { CargaDeTiempoSchema } from "@backend/schemas/CargaDeTiempoSchema";
import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

export default async function patch(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const {id} = req.query;
        const idString = Array.isArray(id) ? id[0]: id;
        const {horas, minutos, comentario, idUsuario, idProcesoDesarrolloOrden} = CargaDeTiempoSchema.parse(req.body);
        
        const cargaDeTiempoActualizada = await prisma.cargaDeTiempo.update({
            where: {
                id: idString,
            },
            data: {
                horas: horas,
                minutos: minutos,
                comentario: comentario,
                usuarioDeCreacion: {
                    connect: {
                        id: idUsuario
                    }
                },
                procesoDesarrolloOrden: {
                    connect: {
                        id: idProcesoDesarrolloOrden
                    }
                }
            }
        });

        res.status(200).json(cargaDeTiempoActualizada);
    }catch(error: any) {
        console.log("Erro en la carga del tiempo: ", error);

        if(error instanceof ZodError) {
            res.status(400).json(error.flatten());
        }
        res.status(500).json(error);
    }
}