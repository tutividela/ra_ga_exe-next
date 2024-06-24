import { ReporteDeCorteMuestra } from "@prisma/client";
import { errorHandle } from "@utils/queries/cotizador";

export async function obtenerReporteCorteMuestraPorProcesoDesarrollo(
  idProcesoDesarrolloOrden: string
): Promise<ReporteDeCorteMuestra[]> {
  return fetch(
    `/api/reportes/procesos/desarrollo/corte/buscar-por-proceso?idProcesoDesarrolloOrden=${idProcesoDesarrolloOrden}`
  )
    .then((response: Response) =>
      response.ok ? response.json() : errorHandle(response)
    )
    .catch((error: any) => {
      throw error;
    });
}

export async function cargarReporteCorteMuestraPorProcesoDesarrollo(
  reporteDeCorteMuestra: Partial<ReporteDeCorteMuestra>
): Promise<ReporteDeCorteMuestra> {
  return fetch(`/api/reportes/procesos/desarrollo/corte/cargar-por-proceso`, {
    method: "POST",
    body: JSON.stringify(reporteDeCorteMuestra),
  })
    .then((response: Response) =>
      response.ok ? response.json() : errorHandle(response)
    )
    .catch((error: any) => {
      throw error;
    });
}

export async function borrarReporteCorteMuestraPorProcesoDesarrollo(
  id: string
): Promise<ReporteDeCorteMuestra> {
  return fetch(
    `/api/reportes/procesos/desarrollo/corte/borrar-por-proceso?id=${id}`,
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
