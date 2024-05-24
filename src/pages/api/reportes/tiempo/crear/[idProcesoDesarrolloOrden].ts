import { CargaDeTiempoSchema } from "@backend/schemas/CargaDeTiempoSchema";
import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

export default async function post(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
        const {query} = req.query;
        const idProcesoDesarrolloOrden = Array.isArray(query) ? query[0]: query;
        const {horas, minutos, comentario, idUsuario} = CargaDeTiempoSchema.parse(req.body);

        const cargaDeTiempoCreada = await prisma.cargaDeTiempo.create({
            data: {
                horas,
                minutos,
                comentario,
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
            },
            include: {
                usuarioDeCreacion: {
                    select: {
                        name: true
                    }
                }
            }
        });

        res.status(201).json(cargaDeTiempoCreada);
    }catch(error: any) {
        console.log("Erro en la carga del tiempo: ", error);

        if(error instanceof ZodError) {
            res.status(400).json(error.flatten());
        }
        res.status(500).json(error);
    }
}