import { RegistroCargaTiempo } from "types/types";
import { errorHandle } from "./cotizador";

export async function obtenerCargasDeTiempoPorIdProcesoDesarrolloOrden(idProcesoDesarrolloOrden: string): Promise<RegistroCargaTiempo[]> {
    return fetch(`/api/reportes/tiempo/obtener/${idProcesoDesarrolloOrden}`, {
        method: 'GET'
    }).then((response: Response) => response.ok? response.json(): errorHandle(response)).catch((error: any) => {
        throw error
    });
}

export async function crearCargaDeTiempoPorIdProcesoDesarrolloOrden(idProcesoDesarrolloOrden: string): Promise<any> {
    return fetch(`/api/reportes/tiempo/crear/${idProcesoDesarrolloOrden}`, {
        method: 'POST'
    }).then((response: Response) => response.ok? response.json(): errorHandle(response)).catch((error: any) => {
        throw error
    });
}