import { ValidatedOrderSchema } from "@backend/schemas/OrderCreationSchema";
import { Prisma, Servicio } from "@prisma/client";
import { prisma } from "@server/db/client";
import { adminRole, ayudanteRole } from "@utils/roles/SiteRoles";

export const updateExpiredOrders = async () => {
  await prisma.orden.updateMany({
    where: {
      expiresAt: { lt: new Date() },
    },
    data: {
      idEstado: 7,
    },
  });
};

export const createOrder = async (data: Prisma.OrdenCreateInput) => {
  return await prisma.orden.create({
    data: data,
  });
};

export const findOrder = async (id: string) => {
  return await prisma.orden.findFirst({
    where: { id: id },
  });
};

export const changeOrderState = async (id: string, newOrderId: number) => {
  return await prisma.orden.update({
    include: { user: true, estado: true },
    where: { id: id },
    data: {
      idEstado: newOrderId,
    },
  });
};

export const verifyUserOrder = async (
  orderId: string | string[],
  userEmail: string
) => {
  const id = Array.isArray(orderId) ? orderId[0] : orderId;
  const order = await prisma.orden.findFirst({
    where: {
      id: id,
    },
    include: {
      user: true,
    },
  });

  //TODO: Check if user is admin
  if (order?.user.email === userEmail) return true;

  const role = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { role: true },
  });

  if (role?.role.name === adminRole || role?.role.name === ayudanteRole)
    return true;

  const recursosAsignados = await prisma.procesoDesarrolloOrden.findMany({
    select: { usuarioDeServicio: { select: { email: true } } },
    where: { idOrden: id },
  });

  return recursosAsignados.some((el) =>
    el.usuarioDeServicio.some((el) => el.email === userEmail)
  );
};

export const getPrecioDolar = async () => {
  return await prisma.precioDelDolar.findFirst({
    where: {
      fechaDesde: {
        lte: new Date(),
      },
      fechaHasta: {
        gte: new Date(),
      },
    },
    orderBy: {
      fechaDesde: "desc",
    },
  });
};

export const findPrendaPrecioByTypeAndComplexity = async (
  tipoId: string,
  complejidadId: string
) => {
  return await prisma.precioPrenda.findFirst({
    include: {
      tipo: true,
      complejidad: true,
    },
    where: {
      complejidadId: complejidadId,
      tipoId: tipoId,
    },
  });
};

export const calculateOrderTotal = async (
  datosDeLaOrden: ValidatedOrderSchema,
  complexityId: string
) => {
  try {
    const { procesosDesarrolloSeleccionados } = datosDeLaOrden;
    let precioTotal = 0;
    const preciosIndividuales = [];

    const precioDolar = await getPrecioDolar();
    const prendaPrecio = await findPrendaPrecioByTypeAndComplexity(
      datosDeLaOrden.tipoPrenda.id,
      complexityId
    );
    const todosProcesoDesarrolloConServicio =
      await prisma.procesoDesarrollo.findMany({
        include: {
          servicio: true,
        },
      });
    Object.entries(procesosDesarrolloSeleccionados).map((procesoDesarrollo) => {
      const precioFijoYFactorMultiplicador = {
        precioFijo: 0,
        factorMultiplicador: 0,
      };
      const [nombre, { selected: seleccionado }] = procesoDesarrollo;

      if (seleccionado) {
        if (nombre === "Corte") {
          const procesoServicioSeleccionado =
            todosProcesoDesarrolloConServicio.find(
              (procesoDesarrolloConServicios) =>
                procesoDesarrolloConServicios.nombre === nombre
            );
          const corteMuestra = procesoServicioSeleccionado.servicio.find(
            (servicio) => servicio.name === "Corte Muestra"
          );

          precioFijoYFactorMultiplicador.precioFijo += corteMuestra.precioFijo;
          precioFijoYFactorMultiplicador.factorMultiplicador +=
            corteMuestra.factorMultiplicador;

          preciosIndividuales.push({
            servicio: nombre,
            precioTotal:
              precioDolar?.precio *
              (prendaPrecio.precioBase *
                precioFijoYFactorMultiplicador.factorMultiplicador +
                precioFijoYFactorMultiplicador.precioFijo),
          });
          return;
        }

        if (nombre === "Confección") {
          const procesoServicioSeleccionado =
            todosProcesoDesarrolloConServicio.find(
              (procesoDesarrolloConServicios) =>
                procesoDesarrolloConServicios.nombre === nombre
            );
          const confeccionMuestra = procesoServicioSeleccionado.servicio.find(
            (servicio) => servicio.name === "Confección Muestra"
          );

          precioFijoYFactorMultiplicador.precioFijo +=
            confeccionMuestra.precioFijo;
          precioFijoYFactorMultiplicador.factorMultiplicador +=
            confeccionMuestra.factorMultiplicador;

          preciosIndividuales.push({
            servicio: nombre,
            precioTotal:
              precioDolar?.precio *
              (prendaPrecio.precioBase *
                precioFijoYFactorMultiplicador.factorMultiplicador +
                precioFijoYFactorMultiplicador.precioFijo),
          });
          return;
        }

        const servicios = todosProcesoDesarrolloConServicio.filter(
          (procesoDesarrolloConServicio) =>
            procesoDesarrolloConServicio.nombre === nombre
        )[0].servicio;

        servicios.forEach((servicio: Servicio) => {
          precioFijoYFactorMultiplicador.precioFijo += servicio.precioFijo;
          precioFijoYFactorMultiplicador.factorMultiplicador +=
            servicio.factorMultiplicador;
        });
        preciosIndividuales.push({
          servicio: nombre,
          precioTotal:
            precioDolar?.precio *
            (prendaPrecio.precioBase *
              precioFijoYFactorMultiplicador.factorMultiplicador +
              precioFijoYFactorMultiplicador.precioFijo),
        });
      }
    });
    preciosIndividuales.forEach(
      (precioIndividual: { servicio: string; precioTotal: number }) =>
        (precioTotal += precioIndividual.precioTotal)
    );

    return {
      precioTotal,
      preciosIndividuales,
      precioDolar,
    };
  } catch (e) {
    console.error("Error en el calculo del precio: ", e);
  }
};

export const getAtributosPrenda = async (orderData: ValidatedOrderSchema) => {
  const atributos = Object.keys(orderData.atributosPrenda)
    .filter((key) => orderData.atributosPrenda[key]?.selected === true)
    .map((key) => {
      return {
        name: key,
        observaciones:
          (orderData.atributosPrenda[key]?.observaciones as string) || "",
        cantidad: (orderData.atributosPrenda[key]?.cantidad as number) || 0,
      };
    });

  return atributos;
};
