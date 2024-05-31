import { NextApiRequest, NextApiResponse } from "next";
import { RegistroEstadoProcesoDesarrolloOrdenSchema } from "@backend/schemas/RegistroEstadoProcesoDesarrolloOrden";
import { ZodError } from "zod";

export default async function post(req: NextApiRequest, res: NextApiResponse) {
    try{
        const {idEstadoProcesoDesarrolloOrden, idUsuario} = RegistroEstadoProcesoDesarrolloOrdenSchema.parse(req.body);
        const {id} = req.query;
        const idProcesoDesarrolloOrdenString = Array.isArray(id) ? id[0]: id;

        const registroGuardado = await prisma.registroCambioEstadoProcesoDesarrolloOrden.create({
            data: {
                procesoDesarrolloOrden: {
                    connect: {
                        id: idProcesoDesarrolloOrdenString
                    }
                },
                estadoProcesoDesarrollo: {
                    connect: {
                        id: idEstadoProcesoDesarrolloOrden
                    }
                },
                usuarioDeCreacion: {
                    connect: {
                        id: idUsuario
                    }
                }
            }
        });

        res.status(200).json(registroGuardado);
    }catch(error: any) {
        console.log("Erro en la carga del tiempo: ", error);

        if(error instanceof ZodError) {
            res.status(400).json(error.flatten());
        }
        res.status(500).json(error);
    }
}