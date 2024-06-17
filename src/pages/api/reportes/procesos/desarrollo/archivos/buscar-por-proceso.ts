import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

export default async function obtener(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const idProcesoDesarrollo = req.query.idProcesoDesarrollo as string;

    const reportesDeArchivo = await prisma.reporteArchivo.findMany({
      where: {
        idProcesoDesarrolloOrden: idProcesoDesarrollo,
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
