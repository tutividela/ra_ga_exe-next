import { ProcesoDigitalizacionSchema } from "@backend/schemas/reportes/ProcesoDigitalizacionSchema";
import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

export default async function cargar(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const cargaDeReporte = ProcesoDigitalizacionSchema.parse(
      JSON.parse(req.body)
    );

    const reporte = await prisma.reporteDeDigitalizacion.findFirst({
      where: {
        idProcesoDesarrolloOrden: cargaDeReporte.idProcesoDesarrolloOrden,
      },
    });

    if (!reporte) {
      const reporteNuevo = await prisma.reporteDeDigitalizacion.create({
        data: {
          idProcesoDesarrolloOrden: cargaDeReporte.idProcesoDesarrolloOrden,
          cantidadDeAviosConMedida: cargaDeReporte.cantidadDeAviosConMedida,
          cantidadDeMateriales: cargaDeReporte.cantidadDeMateriales,
          cantidadDeMoldes: cargaDeReporte.cantidadDeMoldes,
          cantidadDeTalles: cargaDeReporte.cantidadDeTalles,
        },
      });
      res.status(201).json(reporteNuevo);
    }

    const reporteActualizado = await prisma.reporteDeDigitalizacion.update({
      where: {
        id: cargaDeReporte.id,
      },
      data: {
        cantidadDeAviosConMedida: cargaDeReporte.cantidadDeAviosConMedida,
        cantidadDeMateriales: cargaDeReporte.cantidadDeMateriales,
        cantidadDeMoldes: cargaDeReporte.cantidadDeMoldes,
        cantidadDeTalles: cargaDeReporte.cantidadDeTalles,
      },
    });

    res.status(200).json(reporteActualizado);
  } catch (error: any) {
    console.log(
      "Error en la creacion/actualizacion de los reportes de digitalizacion: ",
      error
    );

    if (error instanceof ZodError) {
      res.status(400).json(error.flatten());
    }

    res.status(500).json(error);
  }
}
