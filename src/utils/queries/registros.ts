import { RegistroCargaTiempo } from "types/types";
import { errorHandle } from "./cotizador";
import {
  CargaDeTiempo,
  RegistroCambioEstadoProcesoDesarrolloOrden,
} from "@prisma/client";
import { getReducedUser } from "./user";

export async function obtenerCargasDeTiempoPorIdProcesoDesarrolloOrden(
  idProcesoDesarrolloOrden: string
): Promise<RegistroCargaTiempo[]> {
  return fetch(`/api/reportes/tiempo/obtener/${idProcesoDesarrolloOrden}`, {
    method: "GET",
  })
    .then((response: Response) =>
      response.ok ? response.json() : errorHandle(response)
    )
    .catch((error: any) => {
      throw error;
    });
}

export async function crearCargaDeTiempoPorIdProcesoDesarrolloOrden(
  cargaDeTiempo: Partial<CargaDeTiempo> & { email: string }
): Promise<CargaDeTiempo & { usuarioDeCreacion: { name: string } }> {
  const { idProcesoDesarrolloOrden, horas, minutos, comentario, email } =
    cargaDeTiempo;
  const informacionReducidaDeUsuario = await getReducedUser({ email });
  const body = {
    horas: Number(horas),
    minutos: Number(minutos),
    comentario,
    idUsuario: informacionReducidaDeUsuario?.user?.id,
  };

  return fetch(`/api/reportes/tiempo/crear/${idProcesoDesarrolloOrden}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((response: Response) =>
      response.ok ? response.json() : errorHandle(response)
    )
    .catch((error: any) => {
      throw error;
    });
}

export async function obtenerCargaDeTiempoPorId(
  id: string
): Promise<CargaDeTiempo & { usuarioDeCreacion: { name: string } }> {
  return fetch(`/api/reportes/tiempo/obtener/id/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  })
    .then((response: Response) =>
      response.ok ? response.json() : errorHandle(response)
    )
    .catch((error: any) => {
      throw error;
    });
}

export async function actualizarCargaDeTiempoPorId(
  cargaDeTiempo: Partial<CargaDeTiempo> & { email: string }
): Promise<CargaDeTiempo> {
  const { id, horas, minutos, comentario, email, idProcesoDesarrolloOrden } =
    cargaDeTiempo;
  const informacionReducidaDeUsuario = await getReducedUser({ email });
  const body = {
    horas: Number(horas),
    minutos: Number(minutos),
    comentario,
    idUsuario: informacionReducidaDeUsuario?.user?.id,
    idProcesoDesarrolloOrden,
  };

  return fetch(`/api/reportes/tiempo/editar/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "PATCH",
    body: JSON.stringify(body),
  })
    .then((response: Response) =>
      response.ok ? response.json() : errorHandle(response)
    )
    .catch((error: any) => {
      throw error;
    });
}

export async function eliminarCargaDeTiempoPorId(
  id: string
): Promise<CargaDeTiempo> {
  return fetch(`/api/reportes/tiempo/eliminar/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "DELETE",
  })
    .then((response: Response) =>
      response.ok ? response.json() : errorHandle(response)
    )
    .catch((error: any) => {
      throw error;
    });
}

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
