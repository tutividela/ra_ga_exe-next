import { ProcesoCorteSchema } from "@backend/schemas/reportes/ProcesoCorteMuestraSchema";
import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";
import { prisma } from "@server/db/client";

export default async function cargar(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cargaDeReporte = ProcesoCorteSchema.parse(JSON.parse(req.body));

    const reporteNuevo = await prisma.reporteDeCorteMuestra.create({
      data: {
        idProcesoDesarrolloOrden: cargaDeReporte.idProcesoDesarrolloOrden,
        nombre: cargaDeReporte.nombre,
        cantidad: cargaDeReporte.cantidad,
        esAvio: cargaDeReporte.esAvio,
        tipoDeAvio: cargaDeReporte.tipoDeAvio,
      },
    });

    res.status(201).json(reporteNuevo);
  } catch (error: any) {
    console.log(
      "Error en la creacion/actualizacion de los reportes de corte muestra: ",
      error
    );

    if (error instanceof ZodError) {
      res.status(400).json(error.flatten());
    }

    res.status(500).json(error);
  }
}
