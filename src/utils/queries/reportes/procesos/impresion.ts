import {
  ReporteDeDigitalizacion,
  ReporteDeDisenio,
  ReporteDeImpresion,
} from "@prisma/client";
import { errorHandle } from "@utils/queries/cotizador";

export async function obtenerReporteImpresionPorProcesoDesarrollo(
  idProcesoDesarrolloOrden: string
): Promise<ReporteDeImpresion | null> {
  return fetch(
    `/api/reportes/procesos/desarrollo/impresion/buscar-por-proceso?idProcesoDesarrolloOrden=${idProcesoDesarrolloOrden}`
  )
    .then((response: Response) =>
      response.ok ? response.json() : errorHandle(response)
    )
    .catch((error: any) => {
      throw error;
    });
}

export async function cargarReporteImpresionPorProcesoDesarrollo(
  reporteDeImpresion: Partial<ReporteDeDigitalizacion>
): Promise<ReporteDeImpresion> {
  return fetch(
    `/api/reportes/procesos/desarrollo/impresion/cargar-por-proceso`,
    {
      method: "POST",
      body: JSON.stringify(reporteDeImpresion),
    }
  )
    .then((response: Response) =>
      response.ok ? response.json() : errorHandle(response)
    )
    .catch((error: any) => {
      throw error;
    });
}

export async function borrarReporteImpresionPorProcesoDesarrollo(
  id: string
): Promise<ReporteDeImpresion> {
  return fetch(
    `/api/reportes/procesos/desarrollo/impresion/borrar-por-proceso?id=${id}`,
    {
      method: "DELETE",
    }
  )
    .then((response: Response) =>
      response.ok ? response.json() : errorHandle(response)
    )
    .catch((error: any) => {
      throw error;
    });
}
