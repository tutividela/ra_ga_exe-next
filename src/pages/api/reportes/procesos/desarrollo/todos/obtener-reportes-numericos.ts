import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";
import { prisma } from "@server/db/client";

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const idOrden = req.query.idOrden as string;

    const reportes = await prisma.procesoDesarrolloOrden.findMany({
      where: {
        AND: {
          idOrden: idOrden,
          idProceso: {
            in: [3, 6],
          },
        },
      },
      include: {
        ReportesDeDigitalizacion: {
          select: {
            cantidadDeAviosConMedida: true,
            cantidadDeMateriales: true,
            cantidadDeMoldes: true,
            cantidadDeTalles: true,
          },
        },
        ReportesDeImpresion: {
          select: {
            cantidadDeMetros: true,
          },
        },
      },
    });

    res.status(200).json(reportes);
  } catch (error: any) {
    console.log(
      "Error en la obtencion de los reportes de digitalizacion: ",
      error
    );

    if (error instanceof ZodError) {
      res.status(400).json(error.flatten());
    }

    res.status(500).json(error);
  }
}
