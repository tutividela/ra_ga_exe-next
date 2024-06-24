import { errorHandle } from "../cotizador";
import { RegistroCambioEstadoProcesoDesarrolloOrden } from "@prisma/client";

export async function obtenerRegistrosDeEstadoProcesoDesarrolloOrdenPorIdProcesoDesarrolloOrden(
  idProcesoDesarrolloOrden: string
) {
  return fetch(
    `/api/reportes/registro/obtener/proceso-desarrollo-orden/${idProcesoDesarrolloOrden}`,
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

export async function crearRegistrosDeEstadoProcesoDesarrolloOrdenPorIdProcesoDesarrolloOrden(
  registroDeEstadoProcesoDesarrolloOrden: Partial<RegistroCambioEstadoProcesoDesarrolloOrden> & {
    email: string;
  }
) {
  const { idProcesoDesarrolloOrden } = registroDeEstadoProcesoDesarrolloOrden;

  return fetch(
    `/api/reportes/registro/crear/proceso-desarrollo-orden/${idProcesoDesarrolloOrden}`,
    {
      method: "POST",
    }
  )
    .then((response: Response) =>
      response.ok ? response.json() : errorHandle(response)
    )
    .catch((error: any) => {
      throw error;
    });
}
