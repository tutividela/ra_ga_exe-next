import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@server/db/client";

export default async function buscar(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const emailDePrestador = (req.query.emailDePrestador as string) || "";
    const idProceso = parseInt(req.query.idProceso as string) || 0;
    const idProcesoDesarrollo = (req.query.idProcesoDesarrollo as string) || "";
    const precioPrendaBase =
      parseInt(req.query.precioPrendaBase as string) || 0;

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

    const precioActualizado = await calcularPrecioPorProceso(
      emailDePrestador,
      precio,
      precioPrendaBase,
      idProceso,
      idProcesoDesarrollo
    );

    const response = await prisma.procesoDesarrolloOrden.update({
      where: {
        id: idProcesoDesarrollo,
      },
      data: {
        precioActualizado: precioActualizado,
      },
      select: {
        id: true,
        precioActualizado: true,
        usuarioDeServicio: true,
      },
    });

    res.status(200).json(response);
  } catch (error: any) {
    res.status(500).json(error);
  }
}

async function calcularPrecioPorProceso(
  emailDePrestador: string,
  precioDeDolar: number,
  precioPrendaBase: number,
  idProceso: number,
  idProcesoDesarrollo: string
): Promise<number> {
  switch (idProceso) {
    case 1:
      return (
        (await calcularPrecioMolderia(precioDeDolar, precioPrendaBase)) / 2
      );
    case 2:
      return await calcularPrecioMolderia(precioDeDolar, precioPrendaBase);
    case 3:
      return await calcularPrecioDigitalizacion(
        idProceso,
        precioDeDolar,
        idProcesoDesarrollo
      );
    case 4:
      return 0;
    case 5:
      return await calcularPrecioGeometral(
        precioPrendaBase,
        precioDeDolar,
        idProceso
      );
    case 6:
      return 0;
    case 7:
      return 0;
    case 8:
      return await calcularPrecioTizado(precioDeDolar, idProceso);
    case 9:
      return await calcularPrecioCorteMuestra(
        precioDeDolar,
        precioPrendaBase,
        idProceso
      );
    case 10:
      return await calcularPrecioPreConfeccion(
        emailDePrestador,
        precioDeDolar,
        idProceso
      );
    case 11:
      return await calcularPrecioConfeccionMuestra(
        emailDePrestador,
        precioDeDolar,
        idProceso,
        precioPrendaBase
      );
    case 12:
      return await calcularPrecioTerminado(
        emailDePrestador,
        precioDeDolar,
        idProceso,
        precioPrendaBase
      );
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

async function calcularPrecioMolderia(
  precioDeDolar: number,
  precioPrendaBase: number
): Promise<number> {
  const { factorMultiplicador } = await prisma.servicio.findFirst({
    select: { factorMultiplicador: true },
    where: {
      name: "Moldería Base",
    },
  });

  return factorMultiplicador * precioDeDolar * precioPrendaBase;
}

async function calcularPrecioDigitalizacion(
  idProceso: number,
  precioDeDolar: number,
  idProcesoDesarrollo: string
): Promise<number> {
  const nombreDigitalizacionAvioConMedida =
    "Digitalización y Progresiones (x Avio c/ Medida)";
  const nombreDigitliazacion = "Digitalización y Progresiones";

  const serviciosDeDigitalizacion = await prisma.servicio.findMany({
    select: {
      precioFijo: true,
      name: true,
    },
    where: {
      procesos: {
        every: {
          id: idProceso,
        },
      },
    },
  });

  const { precioFijo: precioFijoAvioConMedida } =
    serviciosDeDigitalizacion.find(
      (servicio) => servicio.name === nombreDigitalizacionAvioConMedida
    ) ?? { precioFijo: 0 };
  const { precioFijo: precioFijoConMolde } = serviciosDeDigitalizacion.find(
    (servicio) => servicio.name === nombreDigitliazacion
  ) ?? { precioFijo: 0 };

  const { cantidadDeAviosConMedida, cantidadDeMoldes } =
    (await prisma.reporteDeDigitalizacion.findFirst({
      select: {
        cantidadDeMoldes: true,
        cantidadDeAviosConMedida: true,
      },
      where: {
        idProcesoDesarrolloOrden: idProcesoDesarrollo,
      },
    })) ?? { cantidadDeAviosConMedida: 0, cantidadDeMoldes: 0 };

  return (
    precioDeDolar *
    (precioFijoConMolde * cantidadDeMoldes +
      precioFijoAvioConMedida * cantidadDeAviosConMedida)
  );
}

async function calcularPrecioGeometral(
  precioPrendaBase: number,
  precioDelDolar: number,
  idProceso: number
): Promise<number> {
  const { factorMultiplicador } = await prisma.servicio.findFirst({
    select: {
      factorMultiplicador: true,
    },
    where: {
      esDeDesarrollo: true,
      procesos: {
        every: {
          id: idProceso,
        },
      },
    },
  });

  return precioPrendaBase * precioDelDolar * factorMultiplicador;
}

async function calcularPrecioTizado(
  precioDeDolar: number,
  idProceso: number
): Promise<number> {
  const servicios = await prisma.servicio.findMany({
    select: {
      precioFijo: true,
    },
    where: {
      esDeDesarrollo: true,
      procesos: {
        every: {
          id: idProceso,
        },
      },
    },
  });

  return servicios
    .map((servicio) => servicio.precioFijo)
    .reduce(
      (acumulador, precioFijo) => acumulador + precioFijo * precioDeDolar,
      0
    );
}

async function calcularPrecioCorteMuestra(
  precioDeDolar: number,
  precioBasePrenda: number,
  idProceso: number
): Promise<number> {
  const servicios = await prisma.servicio.findFirst({
    select: {
      factorMultiplicador: true,
    },
    where: {
      esDeDesarrollo: true,
      procesos: {
        every: {
          id: idProceso,
        },
      },
    },
  });

  return precioDeDolar * precioBasePrenda * servicios.factorMultiplicador;
}

async function calcularPrecioPreConfeccion(
  emailPrestador: string,
  precioDeDolar: number,
  idProceso: number
): Promise<number> {
  const servicios = await prisma.serviciosPorUsuario.findMany({
    where: {
      usuario: {
        email: emailPrestador,
      },
      servicio: {
        AND: {
          esDeDesarrollo: true,
          procesos: {
            every: {
              id: idProceso,
            },
          },
        },
      },
    },
  });

  return servicios
    .map((servicio) => servicio.factorMultiplicador)
    .reduce((acumulador, factor) => acumulador + factor * precioDeDolar, 0);
}

async function calcularPrecioConfeccionMuestra(
  emailPrestador: string,
  precioDeDolar: number,
  idProceso: number,
  precioPrendaBase: number
): Promise<number> {
  const servicio = await prisma.serviciosPorUsuario.findFirst({
    include: {
      servicio: true,
      usuario: true,
    },
    where: {
      servicio: {
        esDeDesarrollo: true,
        procesos: {
          every: {
            id: idProceso,
          },
        },
      },
      usuario: {
        email: emailPrestador,
      },
    },
  });

  const factorMultiplicador = servicio?.factorMultiplicador || 0;

  return precioDeDolar * precioPrendaBase * factorMultiplicador;
}

async function calcularPrecioTerminado(
  emailDePrestador: string,
  precioDeDolar: number,
  idProceso: number,
  precioPrendaBase: number
): Promise<number> {
  const servicio = await prisma.serviciosPorUsuario.findFirst({
    where: {
      usuario: {
        email: emailDePrestador,
      },
      servicio: {
        esDeDesarrollo: true,
        procesos: {
          every: {
            id: idProceso,
          },
        },
      },
    },
  });

  const factorMultiplicador = servicio?.factorMultiplicador || 0;

  return precioDeDolar * precioPrendaBase * factorMultiplicador;
}
