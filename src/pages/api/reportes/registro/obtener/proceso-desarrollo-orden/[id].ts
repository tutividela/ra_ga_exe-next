import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from '@server/db/client';
import { ZodError } from "zod";

export default async function get(req: NextApiRequest, res: NextApiResponse) {
    try {
        const {id} = req.query;
        const valorIdProcesoDesarrolloOrden = Array.isArray(id) ? id[0]: id;

        const registrosDeEstado = await prisma.registroCambioEstadoProcesoDesarrolloOrden.findMany({
            select: {
                id: true,
                usuarioDeCreacion: {
                    select: {
                        name: true,
                    }
                },
                estadoProcesoDesarrollo: {
                    select: {
                        descripcion: true,
                    }
                },
                fechaDeCambio: true,
                idProcesoDesarrolloOrden: true,
                idEstadoProcesoDesarrolloOrden: true,
                idUsuario: true,
            },
            where: {
                idProcesoDesarrolloOrden: valorIdProcesoDesarrolloOrden
            },
            orderBy: {
                fechaDeCambio: "asc"
            }
        });

        res.status(200).json(registrosDeEstado);
    }catch(error: any) {
        console.log("Error en la obtencion de los registros de estado: ", error);

        if(error instanceof ZodError) {
            res.status(400).json(error.flatten());
        }
        
        res.status(500).json(error);
    }
}