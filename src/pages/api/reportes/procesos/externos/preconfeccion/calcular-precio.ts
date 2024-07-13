import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";

export default async function buscar(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const email = (req.query.email as string) || "";
    const cantidad = parseInt(req.query.cantidad as string) || 0;
    const idProcesoPreconfeccion = 10;
    const precioBase = parseInt(req.query.precioBase as string) || 0;

    const precioDelDolar = await prisma.precioDelDolar.findFirst({
      select: {
        precio: true,
      },
      where: {
        AND: {
          fechaDesde: {
            lte: new Date(),
          },
          fechaHasta: {
            gte: new Date(),
          },
        },
      },
    });
    const servicios = await prisma.serviciosPorUsuario.findMany({
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
            procesos: {
              every: {
                id: idProcesoPreconfeccion,
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
        precioDelDolar.precio *
        precioBase *
        factoresMultiplicadoresAcumulados,
    });
  } catch (error: any) {
    res.status(500).json(error);
  }
}
