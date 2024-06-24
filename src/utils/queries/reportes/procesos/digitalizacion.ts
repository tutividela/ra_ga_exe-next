import { ReporteDeDigitalizacion } from "@prisma/client";
import { errorHandle } from "@utils/queries/cotizador";

export async function obtenerReporteDigitalizacionPorProcesoDesarrollo(
  idProcesoDesarrolloOrden: string
): Promise<ReporteDeDigitalizacion | null> {
  return fetch(
    `/api/reportes/procesos/desarrollo/digitalizacion/buscar-por-proceso?idProcesoDesarrolloOrden=${idProcesoDesarrolloOrden}`
  )
    .then((response: Response) =>
      response.ok ? response.json() : errorHandle(response)
    )
    .catch((error: any) => {
      throw error;
    });
}

export async function cargarReporteDigitalizacionPorProcesoDesarrollo(
  reporteDeDigitalizacion: Partial<ReporteDeDigitalizacion>
): Promise<ReporteDeDigitalizacion> {
  return fetch(
    `/api/reportes/procesos/desarrollo/digitalizacion/cargar-por-proceso`,
    {
      method: "POST",
      body: JSON.stringify(reporteDeDigitalizacion),
    }
  )
    .then((response: Response) =>
      response.ok ? response.json() : errorHandle(response)
    )
    .catch((error: any) => {
      throw error;
    });
}

export async function borrarReporteDigitalizacionPorProcesoDesarrollo(
  id: string
): Promise<ReporteDeDigitalizacion> {
  return fetch(
    `/api/reportes/procesos/desarrollo/digitalizacion/borrar-por-proceso?id=${id}`,
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
