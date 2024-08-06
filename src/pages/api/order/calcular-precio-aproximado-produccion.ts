import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";

type ParametroDeCalculo = {
  idProceso: number;
  factores: {
    precioFijo: number;
    factorMultiplicador: number;
    cantidadMinima: number;
    cantidadMaxima: number;
  }[];
};

export default async function calcular(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const precioPrendaBase =
      parseInt(req.query.precioPrendaBase as string) || 0;
    const cantidad = parseInt(req.query.cantidad as string) || 0;

    const procesosDesarrollosDeProduccion =
      await prisma.procesoDesarrollo.findMany({
        where: {
          esDeProduccion: true,
        },
        include: {
          servicio: true,
        },
      });
    const parametrosDeCalculo: ParametroDeCalculo[] =
      procesosDesarrollosDeProduccion.map((proceso) => ({
        idProceso: proceso.id,
        factores: proceso.servicio
          .filter((servicio) => servicio.esDeProduccion)
          .map((servicio) => ({
            precioFijo: servicio.precioFijo,
            factorMultiplicador: servicio.factorMultiplicador,
            cantidadMinima: servicio.cantidadMinima,
            cantidadMaxima: servicio.cantidadMaxima,
          })),
      }));

    const { precio } = await prisma.precioDelDolar.findFirst({
      select: {
        precio: true,
      },
      where: {
        AND: {
          fechaDesde: {
            lte: new Date(),
          },
          fechaHasta: {
            gte: new Date(),
          },
        },
      },
    });

    let precioAproximado = 0;
    parametrosDeCalculo.forEach((parametroDeConsulta) => {
      precioAproximado += calcularPrecioPorProceso(
        parametroDeConsulta,
        precio,
        precioPrendaBase,
        cantidad
      );
    });

    res.status(200).json({ precio: precioAproximado * cantidad });
  } catch (error: any) {
    console.log(error);
    res.status(500).json(error);
  }
}

function calcularPrecioPorProceso(
  parametroDeCalculo: ParametroDeCalculo,
  precioDeDolar: number,
  precioPrendaBase: number,
  cantidad: number
): number {
  switch (parametroDeCalculo.idProceso) {
    case 7:
      return 0;
    case 8:
      return calcularPrecioTizado(parametroDeCalculo, precioDeDolar);
    case 9:
      return calcularPrecioCorte(
        parametroDeCalculo,
        precioDeDolar,
        precioPrendaBase,
        cantidad
      );
    case 10:
      return calcularPrecioPreConfeccion(parametroDeCalculo, precioDeDolar);
    case 11:
      return calcularPrecioConfeccion(
        parametroDeCalculo,
        precioDeDolar,
        precioPrendaBase,
        cantidad
      );
    case 12:
      return calcularPrecioTerminado(parametroDeCalculo, precioDeDolar);
    case 13:
      return 0;
    case 14:
      return 0;
    case 15:
      return 0;
    default:
      return 0;
  }
}
function calcularPrecioTizado(
  parametroDeCalculo: ParametroDeCalculo,
  precioDeDolar: number
): number {
  return parametroDeCalculo.factores
    .map((servicio) => servicio.precioFijo)
    .reduce(
      (acumulador, precioFijo) => acumulador + precioFijo * precioDeDolar,
      0
    );
}

function calcularPrecioCorte(
  parametroDeCalculo: ParametroDeCalculo,
  precioDeDolar: number,
  precioBasePrenda: number,
  cantidad: number
): number {
  const { factorMultiplicador } = parametroDeCalculo.factores.find(
    (parametros) =>
      cantidad >= parametros.cantidadMinima &&
      cantidad <= parametros.cantidadMaxima
  );

  return precioDeDolar * precioBasePrenda * factorMultiplicador;
}

function calcularPrecioPreConfeccion(
  parametroDeCalculo: ParametroDeCalculo,
  precioDeDolar: number
): number {
  return parametroDeCalculo.factores
    .map((parametrosDeFactor) => parametrosDeFactor.factorMultiplicador)
    .reduce((acumulador, factor) => acumulador + factor * precioDeDolar, 0);
}

function calcularPrecioConfeccion(
  parametroDeCalculo: ParametroDeCalculo,
  precioDeDolar: number,
  precioPrendaBase: number,
  cantidad: number
): number {
  const { factorMultiplicador } = parametroDeCalculo.factores.find(
    (parametros) =>
      cantidad >= parametros.cantidadMinima &&
      cantidad <= parametros.cantidadMaxima
  );
  return precioDeDolar * precioPrendaBase * factorMultiplicador;
}

function calcularPrecioTerminado(
  parametroDeCalculo: ParametroDeCalculo,
  precioDeDolar: number
): number {
  return parametroDeCalculo.factores
    .map((parametrosDeFactor) => parametrosDeFactor.factorMultiplicador)
    .reduce((acumulador, factor) => acumulador + factor * precioDeDolar, 0);
}
