import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";
import { prisma } from "@server/db/client";

export default async function get(req: NextApiRequest, res: NextApiResponse) {
  try {
    const idProcesoDesarrollo = req.query.idProcesoDesarrolloOrden as string;

    const reporte = await prisma.reporteDeCorteMuestra.findMany({
      where: {
        idProcesoDesarrolloOrden: idProcesoDesarrollo,
      },
    });

    res.status(200).json(reporte);
  } catch (error: any) {
    console.log(
      "Error en la obtencion de los reportes de corte de muestra: ",
      error
    );

    if (error instanceof ZodError) {
      res.status(400).json(error.flatten());
    }

    res.status(500).json(error);
  }
}
