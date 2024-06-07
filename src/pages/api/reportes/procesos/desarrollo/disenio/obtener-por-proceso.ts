import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  const idProcesoDesarrolloOrden = req.query.idProcesoDesarrolloOrden as string;

  try {
    const reporteDeDisenio = await prisma.reporteDeDisenio.findFirst({
      where: {
        idProcesoDesarrolloOrden: idProcesoDesarrolloOrden,
      },
    });

    res.status(200).json(reporteDeDisenio);
  } catch (error: any) {
    console.log("Error en la obtencion de los reportes de diseño: ", error);

    if (error instanceof ZodError) {
      res.status(400).json(error.flatten());
    }

    res.status(500).json(error);
  }
}
