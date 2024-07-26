import { OrdenProductivaDTOSchema } from "@backend/schemas/OrdenProductivaDTOSchema";
import { prisma } from "@server/db/client";
import { NextApiRequest, NextApiResponse } from "next";

const updateOrderFields = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { idOrden, cantidad, precioEstimado } =
      OrdenProductivaDTOSchema.parse(req.body);

    const procesosDesarrollosDeProduccion =
      await prisma.procesoDesarrollo.findMany({
        where: {
          esDeProduccion: true,
        },
      });

    const ordenCreada = await prisma.ordenProductiva.create({
      data: {
        idOrden: idOrden,
        cantidad: cantidad,
        precioEstimado: precioEstimado,
      },
    });

    const procesos = procesosDesarrollosDeProduccion.map(
      (procesoDesarrollo) => ({
        idProceso: procesoDesarrollo.id,
        idEstadoProceso: 1,
        idOrdenProductiva: ordenCreada.id,
      })
    );

    const procesosProductivosCreados =
      await prisma.procesoProductivoOrden.createMany({
        data: procesos,
      });

    const procesosProductivosDeOrdenCreada =
      await prisma.procesoProductivoOrden.findMany({
        where: {
          idOrdenProductiva: ordenCreada.id,
        },
      });

    await prisma.fichaTecnica.createMany({
      data: procesosProductivosDeOrdenCreada.map((proc) => ({
        procesoProductivoId: proc.id,
      })),
    });

    await prisma.orden.update({
      data: {
        idEstado: 3,
      },
      where: {
        id: idOrden,
      },
    });

    res
      .status(200)
      .json({ ...ordenCreada, procesos: procesosProductivosCreados });
  } catch (error) {
    res.status(500).json({ error: error });
    throw error;
  }
};

export default updateOrderFields;
