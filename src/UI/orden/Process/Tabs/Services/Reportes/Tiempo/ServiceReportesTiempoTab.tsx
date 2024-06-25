import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { useEffect, useMemo, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  orderData: ExtendedOrdenData;
};

export function ServiceReportesTiempoTab({ orderData }: Props) {
  const [showReporteTiempo, setShowReporteTiempo] = useState(false);

  useEffect(() => {
    const ordenDesarrolloFinalizada = orderData?.procesos
      ?.filter((procesoDesarrollo) => procesoDesarrollo.idEstado !== 3)
      .every((procesoDesarrollo) => procesoDesarrollo.idEstado === 6);
    setShowReporteTiempo(ordenDesarrolloFinalizada);
  }, [orderData]);

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

  function generarDatoReporteDeTiempo() {
    const procesosTerminados = obtenerProcesosTerminados();
    const fechaDeCreacionOrden = new Date(orderData?.createdAt);
    const datosReporteDeTiempo = calcularDuracionesPorProcesoDesarrollo(
      procesosTerminados,
      fechaDeCreacionOrden
    );

    return datosReporteDeTiempo.map((datoReporteTiempo) => ({
      id: datoReporteTiempo.idProceso,
      proceso: datoReporteTiempo.proceso,
      ...calcularDiasHorasMinutos(datoReporteTiempo.duracion),
    }));
  }

  function obtenerProcesosTerminados() {
    return (
      orderData?.procesos
        .filter((procesoTerminado) => procesoTerminado.idEstado === 6)
        .sort(
          (procesoAnterior, procesoPosterior) =>
            procesoAnterior.idProceso - procesoPosterior.idProceso
        ) || []
    );
  }

  function calcularDuracionesPorProcesoDesarrollo(
    procesosTerminados,
    fechaDeCreacionOrden: Date
  ): any[] {
    return procesosTerminados.map((procesoTerminado, index) => {
      if (procesoTerminado.idProceso === 1) {
        const fechaUltimaActualizacion = new Date(
          procesoTerminado?.lastUpdated
        );
        return {
          idProceso: procesoTerminado.idProceso,
          proceso: procesoTerminado.proceso,
          duracion:
            fechaUltimaActualizacion.getTime() - fechaDeCreacionOrden.getTime(),
        };
      } else {
        const fechaActualizacionProcesoAnterior = new Date(
          procesosTerminados[index - 1].lastUpdated
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

  function calcularTiempoTotal(): {
    dias: string;
    horas: string;
    minutos: string;
  } {
    const procesosTerminados = obtenerProcesosTerminados();
    const fechaDeCreacionOrden = new Date(orderData?.createdAt);
    const duracionTotal: number = calcularDuracionesPorProcesoDesarrollo(
      procesosTerminados,
      fechaDeCreacionOrden
    )
      .map((duracionDeProceso) => duracionDeProceso.duracion)
      .reduce((total, duracion) => total + duracion, 0);
    return calcularDiasHorasMinutos(duracionTotal);
  }

  const columnas: GridColDef[] = useMemo(
    () => [
      {
        field: "proceso",
        headerName: "Proceso",
        description: "Proceso de desarrollo",
        width: 160,
      },
      {
        field: "dias",
        headerName: "Dias",
        description: "La cantidad de dias demorados",
        width: 100,
      },
      {
        field: "horas",
        headerName: "Horas",
        description: "La cantidad de horas demorados",
        width: 100,
      },
      {
        field: "minutos",
        headerName: "Minutos",
        description: "La cantidad de minutos demorados",
        width: 100,
      },
    ],
    [showReporteTiempo]
  );

  const filas = useMemo(
    () => generarDatoReporteDeTiempo(),
    [showReporteTiempo]
  );
  const duracionTotal = useMemo(
    () => calcularTiempoTotal(),
    [showReporteTiempo]
  );

  function armarDatosParaPieChart() {
    const procesosTerminados = obtenerProcesosTerminados();
    const fechaDeCreacionOrden = new Date(orderData?.createdAt);
    const duracionesDeProcesos = calcularDuracionesPorProcesoDesarrollo(
      procesosTerminados,
      fechaDeCreacionOrden
    );

    return {
      labels: duracionesDeProcesos.map(
        (duracionDeProceso) => duracionDeProceso.proceso
      ),
      datasets: [
        {
          label: "Tiempo",
          data: duracionesDeProcesos.map(
            (duracionDeProceso) => duracionDeProceso.duracion
          ),
          backgroundColor: duracionesDeProcesos.map(
            (duracionDeProceso) =>
              coloresPorProceso.find(
                (colorPorProceso) =>
                  colorPorProceso.idProceso === duracionDeProceso.idProceso
              ).color
          ),
          hoverOffset: 4,
        },
      ],
    };
  }
  const coloresPorProceso = [
    {
      idProceso: 1,
      color: "rgb(150, 196, 255)",
    },
    {
      idProceso: 2,
      color: "rgb(107, 152, 209)",
    },
    {
      idProceso: 3,
      color: "rgb(69, 97, 133)",
    },
    {
      idProceso: 4,
      color: "rgb(66, 93, 128)",
    },
    {
      idProceso: 5,
      color: "rgb(36, 76, 128)",
    },
    {
      idProceso: 6,
      color: "rgb(247, 144, 124)",
    },
    {
      idProceso: 7,
      color: "rgb(179, 105, 91)",
    },
    {
      idProceso: 8,
      color: "rgb(130, 75, 65)",
    },
    {
      idProceso: 9,
      color: "rgb(168, 74, 57)",
    },
    {
      idProceso: 10,
      color: "rgb(120, 51, 38)",
    },
    {
      idProceso: 11,
      color: "rgb(242, 73, 41)",
    },
    {
      idProceso: 12,
      color: "rgb(196, 59, 33)",
    },
    {
      idProceso: 13,
      color: "rgb(138, 42, 23)",
    },
    {
      idProceso: 14,
      color: "rgb(247, 57, 20)",
    },
    {
      idProceso: 15,
      color: "rgb(181, 45, 18)",
    },
  ];
  const datosParaPieChart = useMemo(
    () => armarDatosParaPieChart(),
    [orderData.procesos]
  );

  return (
    <LoadingIndicator show={false} variant="blocking">
      <div
        style={{
          height: 500,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {showReporteTiempo ? (
          <>
            <DataGrid
              rows={filas}
              columns={columnas}
              initialState={{
                pagination: {
                  page: 0,
                  pageSize: 5,
                },
              }}
              components={{
                Toolbar: () => (
                  <GridToolbarContainer>
                    <GridToolbarExport />
                  </GridToolbarContainer>
                ),
              }}
            />
            <div className="m-3">
              <p className="text-l">
                <label className="font-bold">Tiempo total:</label>{" "}
                {duracionTotal.dias} {duracionTotal.horas}{" "}
                {duracionTotal.minutos}
              </p>
            </div>
          </>
        ) : (
          <div className="flex align-middle m-3 justify-center h-auto">
            <p className="font-semibold text-lg">
              La orden no esta actualmente finalizada
            </p>
          </div>
        )}
      </div>
      {showReporteTiempo && (
        <div
          style={{
            height: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Pie data={datosParaPieChart} />
        </div>
      )}
    </LoadingIndicator>
  );
}
