function calcularDiasHorasMinutos(duracion: number) {
  const dias = Math.floor(duracion / (1000 * 60 * 60 * 24));
  const horas = Math.floor(
    (duracion % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutos = Math.floor((duracion % (1000 * 60 * 60)) / (1000 * 60));

  return {
    dias: `${dias} Dias`,
    horas: `${horas} Horas`,
    minutos: `${minutos} Minutos`,
  };
}

//Se usar para armar la tabla de tiempos, tanto para desarrollo como produccion
export function generarDatoReporteDeTiempo(
  procesos: any[],
  fechaDeCreacionOrden: Date
) {
  const datosReporteDeTiempo = calcularDuracionesPorProcesoDesarrollo(
    procesos,
    fechaDeCreacionOrden
  );

  return datosReporteDeTiempo.map((datoReporteTiempo) => ({
    id: datoReporteTiempo.idProceso,
    proceso: datoReporteTiempo.proceso.nombre,
    ...calcularDiasHorasMinutos(datoReporteTiempo.duracion),
  }));
}

export function obtenerProcesosTerminados(datosOrden: any) {
  return datosOrden.idEstado === 3
    ? datosOrden.ordenProductiva.procesos
        .filter((procesoTerminado) => procesoTerminado.idEstadoProceso === 6)
        .sort(
          (procesoAnterior, procesoPosterior) =>
            procesoAnterior.idProceso - procesoPosterior.idProceso
        )
    : datosOrden.procesos
        .filter((procesoTerminado) => procesoTerminado.idEstado === 6)
        .sort(
          (procesoAnterior, procesoPosterior) =>
            procesoAnterior.idProceso - procesoPosterior.idProceso
        );
}

export function calcularDuracionesPorProcesoDesarrollo(
  procesos: any[],
  fechaDeCreacionOrden: Date
): any[] {
  return procesos.map((procesoTerminado, index) => {
    if (index === 0) {
      const fechaUltimaActualizacion = new Date(procesoTerminado?.lastUpdated);
      return {
        idProceso: procesoTerminado.idProceso,
        proceso: procesoTerminado.proceso,
        duracion:
          fechaUltimaActualizacion.getTime() - fechaDeCreacionOrden.getTime(),
      };
    } else {
      const fechaActualizacionProcesoAnterior = new Date(
        procesos[index - 1].lastUpdated
      );
      const fechaActualizacionProcesoActual = new Date(
        procesoTerminado.lastUpdated
      );
      return {
        idProceso: procesoTerminado.idProceso,
        proceso: procesoTerminado.proceso,
        duracion:
          fechaActualizacionProcesoActual.getTime() -
          fechaActualizacionProcesoAnterior.getTime(),
      };
    }
  });
}

export function calcularTiempoTotal(
  procesos: any[],
  fechaDeCreacionOrden: Date
): {
  dias: string;
  horas: string;
  minutos: string;
} {
  const duracionTotal: number = calcularDuracionesPorProcesoDesarrollo(
    procesos,
    fechaDeCreacionOrden
  )
    .map((duracionDeProceso) => duracionDeProceso.duracion)
    .reduce((total, duracion) => total + duracion, 0);
  return calcularDiasHorasMinutos(duracionTotal);
}
