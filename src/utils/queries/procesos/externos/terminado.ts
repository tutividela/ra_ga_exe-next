import { getPrecioDolar } from "@backend/dbcalls/order";
import { getReducedUser } from "@utils/queries/user";

export async function obtenerFactorPrecioServicioExternoTerminado(
  email: string
) {
  const {
    user: { id },
  } = await getReducedUser(email);

  return fetch(
    `/api/reportes/procesos/externos/terminado/buscar-por-usuario?idUsuario=${id}`
  )
    .then((response: Response) => response.json())
    .catch((error: any) => {
      throw error;
    });
}

export async function calcularPrecioTerminado(
  id: string,
  cantidad: number,
  precioBase: number
): Promise<{ precio: number }> {
  return fetch(
    `/api/reportes/procesos/externos/terminado/calcular-precio?idUsuario=${id}&cantidad=${cantidad}&precioBase=${precioBase}`
  )
    .then((response: Response) => response.json())
    .catch((error: any) => {
      throw error;
    });
}
