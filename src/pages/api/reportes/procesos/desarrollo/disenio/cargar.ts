import { ProcesoDisenioSchema } from "@backend/schemas/reportes/ProcesoDisenioSchema";
import { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cargaDeReporte = ProcesoDisenioSchema.parse(JSON.parse(req.body));

    const reporte = await prisma.reporteDeDisenio.findFirst({
      where: {
        idProcesoDesarrolloOrden: cargaDeReporte.idProcesoDesarrolloOrden,
      },
    });

    if (!reporte) {
      const reporteNuevo = await prisma.reporteDeDisenio.create({
        data: {
          comentario: cargaDeReporte.comentario,
          idProcesoDesarrolloOrden: cargaDeReporte.idProcesoDesarrolloOrden,
        },
      });
      res.status(201).json(reporteNuevo);
    }

    const reporteActualizado = await prisma.reporteDeDisenio.update({
      where: {
        id: reporte.id,
      },
      data: {
        comentario: cargaDeReporte.comentario,
      },
    });

    res.status(200).json(reporteActualizado);
  } catch (error: any) {
    console.log(
      "Error en la creacion/actualizacion de los reportes de diseño: ",
      error
    );

    if (error instanceof ZodError) {
      res.status(400).json(error.flatten());
    }

    res.status(500).json(error);
  }
}
