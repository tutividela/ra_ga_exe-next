import { prisma } from "@server/db/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function buscarTodos(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const idOrden = req.body.idOrden as string;

    const ordenConReportes = await prisma.orden.findUnique({
      where: {
        id: idOrden,
      },
      include: {
        procesos: {
          include: {
            proceso: {
              select: {
                nombre: true,
              },
            },
            ReportesDeDisenio: true,
            ReportesDeDigitalizacion: true,
            ReportesDeImpresion: true,
            ReporteDeCorte: true,
            ReportesArchivo: true,
          },
        },
        ordenProductiva: {
          include: {
            procesos: {
              include: {
                proceso: {
                  select: {
                    nombre: true,
                  },
                },
                ReporteArchivo: true,
              },
            },
          },
        },
      },
    });

    const reportesDeDesarrollo = ordenConReportes.procesos.map((proceso) => ({
      id: proceso.id,
      idProceso: proceso.idProceso,
      nombre: proceso.proceso.nombre,
      reportesDeDisenio: proceso.ReportesDeDisenio,
      reportesDeDigitalizacion: proceso.ReportesDeDigitalizacion,
      reportesDeImpresion: proceso.ReportesDeImpresion,
      reportesDeCorte: proceso.ReporteDeCorte,
      reportesDeArchivo: proceso.ReportesArchivo,
    }));

    const reportesDeProduccion =
      ordenConReportes.ordenProductiva?.procesos.map((proceso) => ({
        id: proceso.id,
        idProceso: proceso.idProceso,
        nombre: proceso.proceso.nombre,
        reportesDeArchivo: proceso.ReporteArchivo,
      })) || [];

    res.status(200).json({
      idOrden: ordenConReportes.id,
      estadoOrden: ordenConReportes.idEstado,
      cantidad: ordenConReportes.cantidad,
      disenio: reportesDeDesarrollo,
      produccion: reportesDeProduccion,
    });
  } catch (error) {
    res.status(500).json({ error: error });
    throw error;
  }
}
