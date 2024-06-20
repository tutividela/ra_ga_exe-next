import { ProcesoImpresionSchema } from "@backend/schemas/reportes/ProcesoImpresionSchema";
import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

export default async function cargar(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cargaDeReporte = ProcesoImpresionSchema.parse(JSON.parse(req.body));

    const reporte = await prisma.reporteDeImpresion.findFirst({
      where: {
        idProcesoDesarrolloOrden: cargaDeReporte.idProcesoDesarrolloOrden,
      },
    });

    if (!reporte) {
      const reporteNuevo = await prisma.reporteDeImpresion.create({
        data: {
          idProcesoDesarrolloOrden: cargaDeReporte.idProcesoDesarrolloOrden,
          cantidadDeMetros: cargaDeReporte.cantidadDeMetros,
        },
      });
      res.status(201).json(reporteNuevo);
    }

    const reporteActualizado = await prisma.reporteDeImpresion.update({
      where: {
        id: cargaDeReporte.id,
      },
      data: {
        cantidadDeMetros: cargaDeReporte.cantidadDeMetros,
        idProcesoDesarrolloOrden: cargaDeReporte.idProcesoDesarrolloOrden,
      },
    });

    res.status(200).json(reporteActualizado);
  } catch (error: any) {
    console.log(
      "Error en la creacion/actualizacion de los reportes de impresion: ",
      error
    );

    if (error instanceof ZodError) {
      res.status(400).json(error.flatten());
    }

    res.status(500).json(error);
  }
}
