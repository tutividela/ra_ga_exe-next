import {
  ProcesoDesarrolloOrden,
  ReporteDeDigitalizacion,
  ReporteDeImpresion,
} from "@prisma/client";

export async function obtenerDatosDeReportePorIdProceso(
  idOrden: string
): Promise<
  ProcesoDesarrolloOrden &
    {
      ReportesDeDigitalizacion: ReporteDeDigitalizacion;
      ReportesDeImpresion: ReporteDeImpresion;
    }[]
> {
  return fetch(
    `/api/reportes/procesos/desarrollo/todos/obtener-reportes-numericos?idOrden=${idOrden}`,
    {
      method: "GET",
    }
  )
    .then((response: Response) => response.json())
    .catch((error: any) => {
      throw error;
    });
}
