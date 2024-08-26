import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";
import { prisma } from "@server/db/client";

export default async function obtener(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const idProcesoDesarrollo = req.query.idProcesoDesarrollo as string;
    const esDeProduccion = (req.query.esDeProduccion as string) === "true";

    if (esDeProduccion) {
      const reportesDeArchivo = await prisma.reporteArchivo.findMany({
        where: {
          idProcesoProductivoOrden: idProcesoDesarrollo,
          esDeProduccion: esDeProduccion,
        },
      });

      res.status(200).json(reportesDeArchivo);
      return;
    }
    const reportesDeArchivo = await prisma.reporteArchivo.findMany({
      where: {
        idProcesoDesarrolloOrden: idProcesoDesarrollo,
        esDeProduccion: esDeProduccion,
      },
    });

    res.status(200).json(reportesDeArchivo);
  } catch (error: any) {
    console.log("Error en la obtencion de los reportes de archivos: ", error);

    if (error instanceof ZodError) {
      res.status(400).json(error.flatten());
    }

    res.status(500).json(error);
  }
}
