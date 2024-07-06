export async function obtenerFactorPrecioServicioExternoPreConfeccion(
  email: string
) {
  return fetch(
    `/api/reportes/procesos/externos/preconfeccion/buscar-por-usuario?email=${email}`
  )
    .then((response: Response) => response.json())
    .catch((error: any) => {
      throw error;
    });
}

export async function calcularPrecioPreconfeccion(
  email: string,
  cantidad: number,
  precioBase: number
): Promise<{ precio: number }> {
  console.log(email, cantidad, precioBase);
  return fetch(
    `/api/reportes/procesos/externos/preconfeccion/calcular-precio?email=${email}&cantidad=${cantidad}&precioBase=${precioBase}`,
    { method: "GET" }
  )
    .then((response: Response) => response.json())
    .catch((error: any) => {
      throw error;
    });
}
