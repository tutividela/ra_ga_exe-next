import { ReporteArchivo } from "@prisma/client";
import { errorHandle } from "@utils/queries/cotizador";

export async function obtenerReportesDeArchivosPorIdProcesoDesarrollo(
  idProcesoDesarrollo: string
): Promise<ReporteArchivo[]> {
  return fetch(
    `/api/reportes/procesos/desarrollo/archivos/buscar-por-proceso?idProcesoDesarrollo=${idProcesoDesarrollo}`,
    {
      method: "GET",
    }
  )
    .then((response: Response) =>
      response.ok ? response.json() : errorHandle(response)
    )
    .catch((error: any) => {
      throw error;
    });
}
