import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";
import { prisma } from "@server/db/client";

export default async function borrar(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const id = req.query.id as string;

    const reporte = await prisma.reporteDeCorteMuestra.delete({
      where: {
        id: id,
      },
      select: {
        id: true,
        idProcesoDesarrolloOrden: true,
        nombre: true,
        cantidad: true,
        esAvio: true,
        tipoDeAvio: true,
      },
    });

    res.status(200).json(reporte);
  } catch (error: any) {
    console.log(
      "Error en la eliminacion del reporte de corte muestra: ",
      error
    );

    if (error instanceof ZodError) {
      res.status(400).json(error.flatten());
    }

    res.status(500).json(error);
  }
}
