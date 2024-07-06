export async function actualizarPrecio({
  emailDePrestador,
  idProceso,
  idProcesoDesarrollo,
  precioPrendaBase,
}: {
  emailDePrestador: string;
  idProceso: number;
  idProcesoDesarrollo: string;
  precioPrendaBase: number;
}): Promise<{ id: string; precioActualizado: number }> {
  return fetch(
    `/api/order/actualizar-precio-proceso?emailDePrestador=${emailDePrestador}&idProceso=${idProceso}&idProcesoDesarrollo=${idProcesoDesarrollo}&precioPrendaBase=${precioPrendaBase}`
  )
    .then((response: Response) => response.json())
    .catch((error) => {
      throw error;
    });
}
