import { ReporteDeDisenio } from "@prisma/client";
import { errorHandle } from "@utils/queries/cotizador";

export async function obtenerReporteDiseñoPorProcesoDesarrollo(
  idProcesoDesarrolloOrden: string
): Promise<ReporteDeDisenio> {
  return fetch(
    `/api/reportes/procesos/desarrollo/disenio/obtener-por-proceso?idProcesoDesarrolloOrden=${idProcesoDesarrolloOrden}`
  )
    .then((response: Response) =>
      response.ok ? response.json() : errorHandle(response)
    )
    .catch((error: any) => {
      throw error;
    });
}

export async function cargarReporteDiseñoPorProcesoDesarrollo(
  reporteDeDisenio: ReporteDeDisenio
): Promise<ReporteDeDisenio> {
  return fetch(`/api/reportes/procesos/desarrollo/disenio/cargar`, {
    method: "POST",
    body: JSON.stringify(reporteDeDisenio),
  })
    .then((response: Response) =>
      response.ok ? response.json() : errorHandle(response)
    )
    .catch((error: any) => {
      throw error;
    });
}
