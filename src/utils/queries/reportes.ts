import { RegistroCargaTiempo } from "types/types";
import { errorHandle } from "./cotizador";
import { CargaDeTiempo } from "@prisma/client";
import { getReducedUser } from "./user";

export async function obtenerCargasDeTiempoPorIdProcesoDesarrolloOrden(idProcesoDesarrolloOrden: string): Promise<RegistroCargaTiempo[]> {
    return fetch(`/api/reportes/tiempo/obtener/${idProcesoDesarrolloOrden}`, {
        method: 'GET'
    }).then((response: Response) => response.ok? response.json(): errorHandle(response)).catch((error: any) => {
        throw error
    });
}

export async function crearCargaDeTiempoPorIdProcesoDesarrolloOrden(cargaDeTiempo: Partial<CargaDeTiempo> & {email: string}): Promise<CargaDeTiempo & {usuarioDeCreacion: {name: string}}> {
    const {idProcesoDesarrolloOrden, horas, minutos, comentario, email} = cargaDeTiempo;
    const informacionReducidaDeUsuario = await getReducedUser({email});
    const body = {horas: Number(horas), minutos: Number(minutos), comentario, idUsuario: informacionReducidaDeUsuario?.user?.id}

    return fetch(`/api/reportes/tiempo/crear/${idProcesoDesarrolloOrden}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body)
    }).then((response: Response) => response.ok? response.json(): errorHandle(response)).catch((error: any) => {
        throw error
    });
}