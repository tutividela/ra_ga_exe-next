import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { buscarProcesosDesarrolloYProduccionPor } from "@utils/queries/procesos/procesos";
import { MutableRefObject, useContext, useMemo, useRef } from "react";
import { useQuery } from "react-query";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { Download } from "@mui/icons-material";
import {
  calcularDuracionesPorProcesoDesarrollo,
  generarDatoReporteDeTiempo,
} from "@utils/procesos/tiempos";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  open: boolean;
  onClose: () => void;
  idOrden: string;
};

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

export function DialogReporteDeTiempos({ open, onClose, idOrden }: Props) {
  const { addError } = useContext(ErrorHandlerContext);
  const pieChartRefDesarrollo = useRef(null);
  const pieChartRefProduccion = useRef(null);
  const {
    data: ordenConProcesos,
    isFetching: seEstadoBuscandoLaOrdenConProcesos,
  } = useQuery(
    ["reportes-tiempo", idOrden],
    () => buscarProcesosDesarrolloYProduccionPor(idOrden),
    {
      onError: () =>
        addError(
          "Error al buscar la informacion de tiempo de la orden",
          "error"
        ),
      initialData: null,
      refetchOnWindowFocus: false,
    }
  );

  function descargarPieChart(
    referenciaPieChart: MutableRefObject<any>,
    esDeProduccion?: boolean
  ) {
    const base64PieChart = referenciaPieChart.current.toBase64Image();
    const a = document.createElement("a");

    a.href = base64PieChart;
    a.download = esDeProduccion
      ? "TallerHS_Grafico_Reporte_Tiempo_Produccion"
      : "TallerHS_Grafico_Reporte_Tiempo_Desarrollo";
    a.click();
  }

  function armarDatosParaPieChart(procesos: any, fechaDeCreacionOrden: Date) {
    const procesosAEvaluar = procesos
      .filter((proceso) => proceso.idEstadoProceso !== 3)
      .sort(
        (procesoAnterior, procesoPosterior) =>
          procesoAnterior.idProceso - procesoPosterior.idProceso
      );

    const duracionesDeProcesos = calcularDuracionesPorProcesoDesarrollo(
      procesosAEvaluar,
      fechaDeCreacionOrden
    );

    return {
      labels: duracionesDeProcesos.map(
        (duracionDeProceso) => duracionDeProceso.proceso.nombre
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

  const columnas: GridColDef[] = useMemo(
    () => [
      {
        field: "proceso",
        headerName: "Proceso",
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
    []
  );

  const laOrdenDeDesarrolloEstaFinalizada =
    ordenConProcesos?.procesos
      .filter((proceso) => proceso.idEstadoProceso !== 3)
      .every((proceso) => proceso.idEstadoProceso === 6) || false;

  const laOrdenDeProduccionEstaFinalizada =
    ordenConProcesos?.ordenProductiva?.procesos
      .filter((proceso) => proceso.idEstadoProceso !== 3)
      .every((proceso) => proceso.idEstadoProceso === 6) || false;

  const datosDeTiempoEnDesarrollo = ordenConProcesos
    ? generarDatoReporteDeTiempo(
        ordenConProcesos.procesos
          .filter((proceso) => proceso.idEstadoProceso !== 3)
          .sort(
            (procesoAnterior, procesoPosterior) =>
              procesoAnterior.idProceso - procesoPosterior.idProceso
          ),
        new Date(ordenConProcesos.createdAt)
      )
    : [];
  const datosDeTiempoEnProduccion = ordenConProcesos?.ordenProductiva
    ? generarDatoReporteDeTiempo(
        ordenConProcesos.ordenProductiva.procesos
          .filter((proceso) => proceso.idEstadoProceso !== 3)
          .sort(
            (procesoAnterior, procesoPosterior) =>
              procesoAnterior.idProceso - procesoPosterior.idProceso
          ),
        new Date(ordenConProcesos.ordenProductiva.fechaDeCreacion)
      )
    : [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true}>
      <LoadingIndicator show={seEstadoBuscandoLaOrdenConProcesos}>
        <DialogContent>
          <p className="flex flex-row font-semibold text-xl justify-center mb-3">
            Diseño/Desarrollo
          </p>
          {laOrdenDeDesarrolloEstaFinalizada ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 15,
                  height: "auto",
                  width: "auto",
                }}
              >
                <div
                  style={{
                    height: 500,
                    width: 500,
                  }}
                >
                  <DataGrid
                    rows={datosDeTiempoEnDesarrollo}
                    columns={columnas}
                    initialState={{
                      pagination: {
                        page: 0,
                        pageSize: 6,
                      },
                    }}
                    className=""
                    components={{
                      Toolbar: () => (
                        <GridToolbarContainer>
                          <GridToolbarExport />
                        </GridToolbarContainer>
                      ),
                    }}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    alignSelf: "center",
                    marginTop: 20,
                  }}
                >
                  <div className="flex flex-row justify-center">
                    <Button
                      onClick={() =>
                        descargarPieChart(pieChartRefDesarrollo, false)
                      }
                      variant="outlined"
                      endIcon={<Download />}
                      className="text-xs m-3"
                    >
                      Descargar
                    </Button>
                  </div>
                  <Pie
                    data={armarDatosParaPieChart(
                      ordenConProcesos.procesos,
                      new Date(ordenConProcesos.createdAt)
                    )}
                    ref={pieChartRefDesarrollo}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex align-middle m-3 justify-center h-auto">
              <p className="">
                Actualmente no hay reporte de tiempo para la orden de desarrollo
              </p>
            </div>
          )}
          <p className="flex flex-row font-semibold text-xl justify-center mb-3 mt-10">
            Producción
          </p>
          {laOrdenDeProduccionEstaFinalizada ? (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 15,
                  height: "auto",
                  width: "auto",
                }}
              >
                <div style={{ height: 500, width: 500 }}>
                  <DataGrid
                    rows={datosDeTiempoEnProduccion}
                    columns={columnas}
                    initialState={{
                      pagination: {
                        page: 0,
                        pageSize: 6,
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
                </div>
                <div
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    alignSelf: "center",
                    marginTop: 20,
                  }}
                >
                  <div className="flex flex-row justify-center">
                    <Button
                      onClick={() =>
                        descargarPieChart(pieChartRefProduccion, true)
                      }
                      variant="outlined"
                      endIcon={<Download />}
                      className="text-xs m-3"
                    >
                      Descargar
                    </Button>
                  </div>
                  <Pie
                    data={armarDatosParaPieChart(
                      ordenConProcesos.ordenProductiva.procesos,
                      new Date(ordenConProcesos.ordenProductiva.fechaDeCreacion)
                    )}
                    ref={pieChartRefProduccion}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex align-middle m-3 justify-center h-auto">
              <p className="">
                Actualmente no hay reporte de tiempo para la orden de producción
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={onClose}>
            Cerrar
          </Button>
        </DialogActions>
      </LoadingIndicator>
    </Dialog>
  );
}
