export async function actualizarPrecio({
  emailDePrestador,
  idProceso,
  idProcesoDesarrollo,
  precioPrendaBase,
  esDeProduccion,
  cantidad,
}: {
  emailDePrestador: string;
  idProceso: number;
  idProcesoDesarrollo: string;
  precioPrendaBase: number;
  esDeProduccion: boolean;
  cantidad?: number;
}): Promise<{ id: string; precioActualizado: number }> {
  return fetch(
    `/api/order/actualizar-precio-proceso?emailDePrestador=${emailDePrestador}&idProceso=${idProceso}&idProcesoDesarrollo=${idProcesoDesarrollo}&precioPrendaBase=${precioPrendaBase}&esDeProduccion=${esDeProduccion}&cantidad=${cantidad}`
  )
    .then((response: Response) => response.json())
    .catch((error) => {
      throw error;
    });
}

export async function obtenerServiciosExternosPor(email: string) {
  return fetch(`/api/services/externos/buscar-por-email?email=${email}`)
    .then((response: Response) => response.json())
    .catch((error) => {
      throw error;
    });
}

export async function obtenerUnServicioExternoPor(id: string) {
  return fetch(`/api/services/externos/buscar-por-id?id=${id}`)
    .then((response: Response) => response.json())
    .catch((error) => {
      throw error;
    });
}
