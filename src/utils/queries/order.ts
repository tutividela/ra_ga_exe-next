import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import { errorHandle } from "./cotizador";
import { OrdenProductivaSchemaDTOType } from "@backend/schemas/OrdenProductivaDTOSchema";

// Fetch orders based on email
export const fetchOrderFromEmail = (
  emailToFetchOrders
): Promise<ExtendedOrdenData[]> =>
  fetch(`/api/orders/obtain`, {
    method: "POST",
    body: JSON.stringify(emailToFetchOrders),
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
  })
    .then((res) => (res.ok ? res.json() : errorHandle(res)))
    .catch((error) => {
      throw error;
    });

// Fetch all orders
export const fetchAllOrders = (): Promise<ExtendedOrdenData[]> =>
  fetch(`/api/orders/obtain`, {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "application/json" },
  })
    .then((res) => (res.ok ? res.json() : errorHandle(res)))
    .catch((error) => {
      throw error;
    });

export function generarOrdenProductiva(
  ordenProductivaDTO: OrdenProductivaSchemaDTOType
) {
  return fetch("/api/order/generar-orden-productiva", {
    method: "POST",
    body: JSON.stringify(ordenProductivaDTO),
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
  })
    .then((response) => (response.ok ? response.json() : errorHandle(response)))
    .catch((error) => {
      throw error;
    });
}

export async function calcularOrdenProductiva(
  cantidad: number,
  precioPrendaBase: number
): Promise<{ precio: number }> {
  return fetch(
    `/api/order/calcular-precio-aproximado-produccion?cantidad=${cantidad}&precioPrendaBase=${precioPrendaBase}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    }
  )
    .then((response) => (response.ok ? response.json() : errorHandle(response)))
    .catch((error) => {
      throw error;
    });
}

export async function buscarTodasLasOrdenes(): Promise<
  {
    cantidad: number;
    user: {
      name: string;
    };
    id: string;
    nombre: string;
    estado: {
      nombre: string;
    };
    createdAt: Date;
  }[]
> {
  return fetch("/api/orders/obtainAll", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
  })
    .then((response) => (response.ok ? response.json() : errorHandle(response)))
    .catch((error) => {
      throw error;
    });
}
