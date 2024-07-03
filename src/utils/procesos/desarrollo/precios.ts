import { PrecioServicioExtended } from "@utils/queries/cotizador";
import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import {
  ReporteDeDigitalizacion,
  ReporteDeImpresion,
  ProcesoDesarrolloOrden,
  Servicio,
  ProcesoDesarrollo,
} from "@prisma/client";

type ProcesoDesarrolloConServicios = Servicio & {
  procesos: ProcesoDesarrollo[];
};
type ReporteConDatosNumericos = ProcesoDesarrolloOrden & {
  ReportesDeDigitalizacion: ReporteDeDigitalizacion;
  ReportesDeImpresion: ReporteDeImpresion;
};

function calcularPrecioMolderiaBase(
  servicioPrecioDelDolar: PrecioServicioExtended,
  servicios: ProcesoDesarrolloConServicios[],
  precioBasePrenda: number
): number {
  const precioDelDolar = servicioPrecioDelDolar?.precioBase;
  const servicioMolderia = servicios?.find(
    (servicio) => servicio.name === "Moldería Base"
  );

  return (
    precioBasePrenda * precioDelDolar * servicioMolderia?.factorMultiplicador
  );
}

function calcularPrecioDiseño(
  servicioPrecioDelDolar: PrecioServicioExtended,
  servicios: ProcesoDesarrolloConServicios[],
  precioBasePrenda: number
): number {
  return (
    calcularPrecioMolderiaBase(
      servicioPrecioDelDolar,
      servicios,
      precioBasePrenda
    ) / 2
  );
}

function calcularPrecioDigitalizacion(
  servicioPrecioDelDolar: PrecioServicioExtended,
  servicios: ProcesoDesarrolloConServicios[],
  reportesConDatosNumericos: ReporteConDatosNumericos[]
): number {
  const idDigitalizacionPorAvio = "clxxoh44a0002wd7855vzxyhc";
  const idDigitliazacionPorMolde = "cl90d1q8t000h356tylhao6tc";
  const precioDelDolar = servicioPrecioDelDolar?.precioBase;
  const factoresMultiplicadoresYIds = servicios.map((servicio) => ({
    precioFijo: servicio.precioFijo,
    id: servicio.id,
  }));
  const reporteDeDigitalizacion = reportesConDatosNumericos?.find(
    (reporte) => reporte.ReportesDeDigitalizacion !== null
  );

  const precioFijoDigitalizacionPorAvio = factoresMultiplicadoresYIds.find(
    (factor) => factor.id === idDigitalizacionPorAvio
  ).precioFijo;
  const precioFijoDigitalizacionPorMolde = factoresMultiplicadoresYIds.find(
    (factor) => factor.id === idDigitliazacionPorMolde
  ).precioFijo;

  return reporteDeDigitalizacion
    ? precioDelDolar *
        (reporteDeDigitalizacion?.ReportesDeDigitalizacion
          ?.cantidadDeAviosConMedida *
          precioFijoDigitalizacionPorAvio +
          reporteDeDigitalizacion?.ReportesDeDigitalizacion?.cantidadDeMoldes *
            precioFijoDigitalizacionPorMolde)
    : 0;
}

function calcularPrecioGeometral(
  servicioPrecioDelDolar: PrecioServicioExtended,
  servicios: ProcesoDesarrolloConServicios[]
): number {
  const precioDelDolar = servicioPrecioDelDolar?.precioBase;
  const factoresMultiplicadores = servicios
    .filter(
      (servicio) => servicio.esDeDesarrollo && servicio.procesos[0].id === 5
    )
    .map((servicio) => servicio.precioFijo);

  return factoresMultiplicadores
    .map((factorMultiplicador) => factorMultiplicador * precioDelDolar)
    .reduce((total, subtotal) => total + subtotal, 0);
}

function calcularPrecioImpresion(): number {
  return 0;
}

function calcularPrecioTizado(
  servicioPrecioDelDolar: PrecioServicioExtended,
  servicios: ProcesoDesarrolloConServicios[]
): number {
  const precioDelDolar = servicioPrecioDelDolar?.precioBase;
  const factoresMultiplicadores = servicios
    .filter(
      (servicio) => servicio.esDeDesarrollo && servicio.procesos[0].id === 8
    )
    .map((servicio) => servicio.precioFijo);

  return precioDelDolar
    ? factoresMultiplicadores.reduce(
        (total, factorMultiplicador) =>
          total + factorMultiplicador * precioDelDolar,
        0
      )
    : 0;
}

function calcularPrecioCorteMuestra(
  servicioPrecioDelDolar: PrecioServicioExtended,
  servicios: ProcesoDesarrolloConServicios[]
): number {
  const precioDelDolar = servicioPrecioDelDolar?.precioBase;
  const factoresMultiplicadores = servicios
    .filter(
      (servicio) => servicio.esDeDesarrollo && servicio.procesos[0].id === 9
    )
    .map((servicio) => servicio.factorMultiplicador);

  return precioDelDolar
    ? factoresMultiplicadores.reduce(
        (total, factorMultiplicador) =>
          total + factorMultiplicador * precioDelDolar,
        0
      )
    : 0;
}

function calcularPrecioPreConfeccion(
  servicioPrecioDelDolar: PrecioServicioExtended,
  servicios: ProcesoDesarrolloConServicios[]
): number {
  const precioDelDolar = servicioPrecioDelDolar?.precioBase;
  const factoresMultiplicadores = servicios
    .filter(
      (servicio) => servicio.esDeDesarrollo && servicio.procesos[0].id === 10
    )
    .map((servicio) => servicio.precioFijo);

  return precioDelDolar
    ? factoresMultiplicadores.reduce(
        (total, factorMultiplicador) =>
          total + factorMultiplicador * precioDelDolar,
        0
      )
    : 0;
}

function calcularPrecioConfeccionMuestra(
  servicioPrecioDelDolar: PrecioServicioExtended,
  servicios: ProcesoDesarrolloConServicios[]
): number {
  const precioDelDolar = servicioPrecioDelDolar?.precioBase;
  const factoresMultiplicadores = servicios
    .filter(
      (servicio) => servicio.esDeDesarrollo && servicio.procesos[0].id === 11
    )
    .map((servicio) => servicio.precioFijo);

  return precioDelDolar
    ? factoresMultiplicadores.reduce(
        (total, factorMultiplicador) =>
          total + factorMultiplicador * precioDelDolar,
        0
      )
    : 0;
}

function calcularPrecioTerminado(
  servicioPrecioDelDolar: PrecioServicioExtended,
  servicios: ProcesoDesarrolloConServicios[]
): number {
  const precioDelDolar = servicioPrecioDelDolar?.precioBase;
  const factoresMultiplicadores = servicios
    .filter(
      (servicio) => servicio.esDeDesarrollo && servicio.procesos[0].id === 12
    )
    .map((servicio) => servicio.factorMultiplicador);

  return precioDelDolar
    ? factoresMultiplicadores.reduce(
        (total, factorMultiplicador) =>
          total + factorMultiplicador * precioDelDolar,
        0
      )
    : 0;
}

export function calcularPrecioActualizadoDeProceso(
  idProceso: number,
  precioBasePrenda: number,
  servicios: ProcesoDesarrolloConServicios[],
  servicioPrecioDelDolar: PrecioServicioExtended,
  reportesConDatosNumericos: any
): number {
  switch (idProceso) {
    case 1:
      return calcularPrecioDiseño(
        servicioPrecioDelDolar,
        servicios,
        precioBasePrenda
      );
    case 2:
      return calcularPrecioMolderiaBase(
        servicioPrecioDelDolar,
        servicios,
        precioBasePrenda
      );
    case 3:
      return calcularPrecioDigitalizacion(
        servicioPrecioDelDolar,
        servicios,
        reportesConDatosNumericos
      );
    case 5:
      return calcularPrecioGeometral(servicioPrecioDelDolar, servicios);
    case 6:
      return calcularPrecioImpresion();
    case 8:
      return calcularPrecioTizado(servicioPrecioDelDolar, servicios);
    case 9:
      return calcularPrecioCorteMuestra(servicioPrecioDelDolar, servicios);
    case 10:
      return calcularPrecioPreConfeccion(servicioPrecioDelDolar, servicios);
    case 11:
      return calcularPrecioConfeccionMuestra(servicioPrecioDelDolar, servicios);
    case 12:
      return calcularPrecioTerminado(servicioPrecioDelDolar, servicios);
    default:
      return 0;
  }
}

export function calcularPrecioDeDesarrolloTotal(
  precioBasePrenda: number,
  servicios: ProcesoDesarrolloConServicios[],
  servicioPrecioDelDolar: PrecioServicioExtended,
  reportesConDatosNumericos: any
): number {
  return (
    calcularPrecioDiseño(servicioPrecioDelDolar, servicios, precioBasePrenda) +
    calcularPrecioMolderiaBase(
      servicioPrecioDelDolar,
      servicios,
      precioBasePrenda
    ) +
    calcularPrecioDigitalizacion(
      servicioPrecioDelDolar,
      servicios,
      reportesConDatosNumericos
    ) +
    calcularPrecioGeometral(servicioPrecioDelDolar, servicios) +
    calcularPrecioImpresion() +
    calcularPrecioTizado(servicioPrecioDelDolar, servicios) +
    calcularPrecioCorteMuestra(servicioPrecioDelDolar, servicios) +
    calcularPrecioPreConfeccion(servicioPrecioDelDolar, servicios) +
    calcularPrecioConfeccionMuestra(servicioPrecioDelDolar, servicios) +
    calcularPrecioTerminado(servicioPrecioDelDolar, servicios)
  );
}
