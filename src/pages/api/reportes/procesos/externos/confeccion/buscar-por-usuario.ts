import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";

export default async function buscar(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const email = req.query.email as string;
    const valorEsDesarrollo = req.query.esDesarrollo as string;
    const esDesarrollo = valorEsDesarrollo === "true" ? true : false;

    const idProcesoConfeccion = 11;

    const servicio = await prisma.serviciosPorUsuario.findMany({
      select: {
        idUsuario: true,
        idServicio: true,
        factorMultiplicador: true,
        servicio: {
          select: {
            name: true,
          },
        },
      },
      where: {
        AND: {
          usuario: {
            email: email,
          },
          servicio: {
            esDeDesarrollo: esDesarrollo,
            procesos: {
              every: {
                id: idProcesoConfeccion,
              },
            },
          },
        },
      },
    });

    res.status(200).json(servicio);
  } catch (error: any) {
    res.status(500).json(error);
  }
}
