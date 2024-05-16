import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@server/db/client';

const get = async (req: NextApiRequest, res: NextApiResponse) => {
    try{
        const {idProcesoDesarrolloOrden} = req.query;
        const valorIdProcesoDesarrolloOrden = Array.isArray(idProcesoDesarrolloOrden) ? idProcesoDesarrolloOrden[0]: idProcesoDesarrolloOrden;

        const cargas = await prisma.cargaDeTiempo.findMany({
            where: {
                idProcesoDesarrolloOrden: valorIdProcesoDesarrolloOrden
            },
            select: {
                comentario: true,
                horas: true,
                minutos: true,
                fechaDeCarga: true,
                fechaDeActualizacion: true,
                usuarioDeCreacion: {
                   select: {
                    name: true
                   } 
                }

            }
        });

        res.status(200).json(cargas);
    }catch(error: any) {
        res.status(500).json({ error: error })
        throw error;
    }
}

export default get;