import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";
import { prisma } from "@server/db/client";

export default async function borrar(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const id = req.query.id as string;

    const reporte = await prisma.reporteDeDigitalizacion.delete({
      where: {
        id: id,
      },
      select: {
        id: true,
        idProcesoDesarrolloOrden: true,
        cantidadDeAviosConMedida: true,
        cantidadDeMateriales: true,
        cantidadDeMoldes: true,
        cantidadDeTalles: true,
      },
    });

    res.status(200).json(reporte);
  } catch (error: any) {
    console.log(
      "Error en la eliminacion del reporte de digitalizacion: ",
      error
    );

    if (error instanceof ZodError) {
      res.status(400).json(error.flatten());
    }

    res.status(500).json(error);
  }
}
