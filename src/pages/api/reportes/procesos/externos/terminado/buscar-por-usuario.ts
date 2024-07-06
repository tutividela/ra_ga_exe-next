import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";

export default async function buscar(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const email = req.query.email as string;
    const idProcesoTerminado = 12;

    const servicio = await prisma.serviciosPorUsuario.findMany({
      select: {
        idUsuario: true,
        idServicio: true,
        factorMultiplicador: true,
      },
      where: {
        AND: {
          usuario: {
            email: email,
          },
          servicio: {
            procesos: {
              every: {
                id: idProcesoTerminado,
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
