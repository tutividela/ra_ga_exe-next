import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";

export default async function buscar(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const idUsuario = req.query.idUsuario as string;
    const cantidad = parseInt(req.query.cantidad as string) || 0;
    const idProcesoTerminado = 12;
    const precioBase = parseInt(req.query.precioBase as string) || 0;
    const precioDeDolar = parseInt(req.query.precioDeDolar as string) || 0;

    const servicios = await prisma.serviciosPorUsuario.findMany({
      select: {
        idUsuario: true,
        idServicio: true,
        factorMultiplicador: true,
      },
      where: {
        AND: {
          idUsuario: idUsuario,
          servicio: {
            AND: {
              procesos: {
                every: {
                  id: idProcesoTerminado,
                },
              },
            },
          },
        },
      },
    });

    const factoresMultiplicadoresAcumulados = servicios
      .map((servicio) => servicio.factorMultiplicador)
      .reduce((acumulador, factor) => acumulador + factor, 0);

    res.status(200).json({
      precio:
        cantidad *
        precioDeDolar *
        precioBase *
        factoresMultiplicadoresAcumulados,
    });
  } catch (error: any) {
    res.status(500).json(error);
  }
}
