import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@server/db/client';
import { CargaDeTiempo } from "@prisma/client";
import { ZodError } from "zod";

export default async function del(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try{
        const {id} = req.query;
        const idCargaDeTiempo = Array.isArray(id)? id[0]: id;
        const cargaDeTiempoBorrada: Partial<CargaDeTiempo> = await prisma.cargaDeTiempo.delete({
            where: {
                id: idCargaDeTiempo
            },
            select: {
                id: true,
                horas: true,
                minutos: true,
                comentario: true,
                idUsuario: true,
                idProcesoDesarrolloOrden: true,
            }, 
        });

        res.status(200).json(cargaDeTiempoBorrada);
    }catch(error: any) {
        console.log("Error en la eliminacion del tiempo: ", error);

        if(error instanceof ZodError) {
            res.status(400).json(error.flatten());
        }
        
        res.status(500).json(error);
    }
}