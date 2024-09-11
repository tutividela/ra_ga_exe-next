import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import {
  ReporteArchivo,
  ReporteDeCorteMuestra,
  ReporteDeDigitalizacion,
  ReporteDeImpresion,
} from "@prisma/client";
import OrderImageItem from "@UI/orden/Process/Tabs/General/Files/OrderImageItem";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { buscarTodosLosReportesPor } from "@utils/queries/procesos/procesos";
import { useContext } from "react";
import { useQuery } from "react-query";

type Props = {
  open: boolean;
  onClose: () => void;
  idOrden: string;
};

export function DialogReporteDeProcesos({ open, onClose, idOrden }: Props) {
  const { addError } = useContext(ErrorHandlerContext);
  const columnasReporteDigitalizacion: GridColDef[] = [
    {
      field: "cantidadDeMoldes",
      headerName: "Cantidad de Moldes",
      width: 150,
      align: "center",
    },
    {
      field: "cantidadDeAviosConMedida",
      headerName: "Cantidad de Avios con Medida",
      width: 220,
      align: "center",
    },
    {
      field: "cantidadDeTalles",
      headerName: "Cantidad de Talles",
      width: 150,
      align: "center",
    },
    {
      field: "cantidadDeMateriales",
      headerName: "Cantidad de Materiales",
      width: 180,
      align: "center",
    },
  ];
  const columnasReporteImpresion: GridColDef[] = [
    {
      field: "cantidadDeMetros",
      headerName: "Cantidad de Moldes",
      width: 150,
      align: "center",
    },
  ];
  const columnasReporteCorteMuestra: GridColDef[] = [
    {
      headerName: "Nombre del Material",
      field: "nombre",
      headerAlign: "center",
      width: 150,
      align: "center",
    },
    {
      field: "cantidad",
      headerAlign: "center",
      headerName: "Consumo",
      width: 220,
      align: "center",
    },
    {
      field: "esAvio",
      headerAlign: "center",
      headerName: "¿Es Avio?",
      width: 150,
      align: "center",
    },
    {
      field: "tipoDeAvio",
      headerAlign: "center",
      headerName: "Tipo de avio",
      width: 180,
      align: "center",
    },
  ];

  const { data: reportes, isFetching: seEstanBuscandoReportes } = useQuery(
    ["reportes", idOrden],
    () => buscarTodosLosReportesPor(idOrden),
    {
      onError: () =>
        addError("Error al buscar los reportes de la orden", "error"),
      initialData: null,
      refetchOnWindowFocus: false,
    }
  );

  const laOrdenPuedeTenerUnaProduccion = reportes?.cantidad === 1 || false;

  const reporteDeDiseño =
    (reportes?.disenio.find((reporte) => reporte.idProceso === 1)
      ?.reportesDeDisenio?.comentario as string) || "";

  const reporteDeMolderia = reportes?.disenio.find(
    (reporte) => reporte.idProceso === 2
  )?.reportesDeArchivo as ReporteArchivo[];

  const reporteDeDigitalizacion =
    (reportes?.disenio.find((reporte) => reporte.idProceso === 3)
      ?.reportesDeDigitalizacion as ReporteDeDigitalizacion) || null;

  const archivosDeReporteDigitalizacion = reportes?.disenio.find(
    (reporte) => reporte.idProceso === 3
  )?.reportesDeArchivo as ReporteArchivo[];

  const reporteDeGeometral = reportes?.disenio.find(
    (reporte) => reporte.idProceso === 5
  )?.reportesDeArchivo as ReporteArchivo[];

  const reporteDeImpresion =
    (reportes?.disenio.find((reporte) => reporte.idProceso === 6)
      ?.reportesDeDigitalizacion as ReporteDeImpresion) || null;

  const reporteDeTizado = reportes?.disenio.find(
    (reporte) => reporte.idProceso === 8
  )?.reportesDeArchivo as ReporteArchivo[];

  const reporteDeCorteMuestra =
    (reportes?.disenio.find((reporte) => reporte.idProceso === 9)
      ?.reportesDeCorte as ReporteDeCorteMuestra[]) || [];

  const reporteDePreconfeccion = reportes?.disenio.find(
    (reporte) => reporte.idProceso === 10
  )?.reportesDeArchivo as ReporteArchivo[];

  const reporteDeConfeccion = reportes?.disenio.find(
    (reporte) => reporte.idProceso === 11
  )?.reportesDeArchivo as ReporteArchivo[];

  const reporteDeTerminado = reportes?.disenio.find(
    (reporte) => reporte.idProceso === 12
  )?.reportesDeArchivo as ReporteArchivo[];

  const reporteDePlanchado = reportes?.disenio.find(
    (reporte) => reporte.idProceso === 13
  )?.reportesDeArchivo as ReporteArchivo[];

  const reporteDeEntregado = reportes?.disenio.find(
    (reporte) => reporte.idProceso === 13
  )?.reportesDeArchivo as ReporteArchivo[];

  const ReporteDeDiseño = () =>
    reporteDeDiseño ? (
      <div className="flex flex-col m-3">
        <p className="font-semibold">Diseño</p>
        <div className="m-4 border-4 shadow-lg min-h-[16rem] max-h-[20rem] flex p-4 flex-col space-y-2">
          {reporteDeDiseño}
        </div>
      </div>
    ) : (
      <div className="flex flex-col p-3 items-center">
        <p>No hay reporte de Diseño</p>
      </div>
    );
  const ReporteDeDigitalizacion = () => (
    <div className="flex flex-col m-3">
      <p className="font-semibold">Digitalización y Progresiones</p>
      <div>
        {reporteDeDigitalizacion ? (
          <DataGrid
            columns={columnasReporteDigitalizacion}
            rows={reporteDeDigitalizacion ? [reporteDeDigitalizacion] : []}
            pageSize={1}
            className="h-52"
            components={{
              Toolbar: () => (
                <GridToolbarContainer>
                  <GridToolbarExport />
                </GridToolbarContainer>
              ),
            }}
          />
        ) : (
          <div className="flex flex-col p-3 items-center">
            <p>
              No hay cantidades de Moldes, Avios con medida, Talles y Materiales
              cargadas
            </p>
          </div>
        )}
      </div>
      <div className="">
        {archivosDeReporteDigitalizacion.length > 0 ? (
          archivosDeReporteDigitalizacion.map((reporte) => (
            <OrderImageItem archivo={reporte} key={reporte.id} />
          ))
        ) : (
          <div className="flex flex-col p-3 items-center">
            <p>No hay reportes de archivo para Digitalización y Progresiones</p>
          </div>
        )}
      </div>
    </div>
  );
  const ReporteDeImpresion = () => (
    <div className="m-3">
      <p className="font-semibold">Impresión</p>
      {reporteDeImpresion ? (
        <div className="flex flex-col">
          <div>
            <DataGrid
              columns={columnasReporteImpresion}
              rows={reporteDeImpresion ? [reporteDeImpresion] : []}
              pageSize={1}
              className="h-52"
              components={{
                Toolbar: () => (
                  <GridToolbarContainer>
                    <GridToolbarExport />
                  </GridToolbarContainer>
                ),
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col p-3 items-center">
          <p>No hay reporte de Impresión</p>
        </div>
      )}
    </div>
  );
  function componentesReporteDeArchivos(
    reportesDeArchivos: ReporteArchivo[],
    proceso: string
  ) {
    return (
      <div className="m-3">
        <p className="font-semibold">{proceso}</p>
        {reportesDeArchivos.length > 0 ? (
          <div className="flex flex-col">
            {reportesDeArchivos.map((reporte) => (
              <OrderImageItem archivo={reporte} key={reporte.id} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col p-3 items-center">
            <p>No hay archivos de reporte de {proceso}</p>
          </div>
        )}
      </div>
    );
  }
  const ReporteDeCorteMuestra = () => (
    <div className="flex flex-col m-3">
      <p className="font-semibold">Corte Muestra</p>
      <div>
        {reporteDeCorteMuestra.length > 0 ? (
          <DataGrid
            columns={columnasReporteCorteMuestra}
            rows={reporteDeCorteMuestra ? reporteDeCorteMuestra.map((reporte) => ({
              ...reporte,
              esAvio: reporte.esAvio ? "Si" : "No",
              tipoDeAvio: reporte.tipoDeAvio === "Sin Especificar" ? "N/A" : reporte.tipoDeAvio
            })) : []}
            pageSize={5}
            className="h-96"
          />
        ) : (
          <div className="flex flex-col p-3 items-center">
            <p>No hay reporte de Corte Muestra cargado</p>
          </div>
        )}
      </div>
    </div>
  );
  const ReportesDeProduccion = () => {
    const hayReportesDeProduccion =
      reportes?.produccion?.some(
        (proceso) => proceso.reportesDeArchivo.length > 0
      ) || false;

    return laOrdenPuedeTenerUnaProduccion ? (
      hayReportesDeProduccion ? (
        reportes.produccion.map((reporte) =>
          componentesReporteDeArchivos(
            reporte.reportesDeArchivo,
            reporte.nombre
          )
        )
      ) : (
        <div className="flex flex-col p-3 items-center">
          <p>No hay reportes de producción cargados aún</p>
        </div>
      )
    ) : (
      <div className="flex flex-col p-3 items-center">
        <p>La orden no tiene reportes de producción</p>
      </div>
    );
  };

  return (
    <div className="max-w-full">
      <Dialog open={open} onClose={onClose} fullWidth={true}>
        <LoadingIndicator show={seEstanBuscandoReportes}>
          <DialogContent>
            {reportes ? (
              <div>
                <p className="flex flex-row font-semibold text-xl justify-center mb-3">
                  Diseño/Desarrollo
                </p>
                <div>
                  <div className="flex flex-col h-full w-full">
                    <ReporteDeDiseño />
                    {componentesReporteDeArchivos(
                      reporteDeMolderia,
                      "Molderia"
                    )}
                    <ReporteDeDigitalizacion />
                    {componentesReporteDeArchivos(
                      reporteDeGeometral,
                      "Geometral"
                    )}
                    <ReporteDeImpresion />
                    {componentesReporteDeArchivos(reporteDeTizado, "Tizado")}
                    <ReporteDeCorteMuestra />
                    {componentesReporteDeArchivos(
                      reporteDePreconfeccion,
                      "Pre-confeccion"
                    )}
                    {componentesReporteDeArchivos(
                      reporteDeConfeccion,
                      "Confeccion Muestra"
                    )}
                    {componentesReporteDeArchivos(
                      reporteDeTerminado,
                      "Terminado"
                    )}
                    {componentesReporteDeArchivos(
                      reporteDePlanchado,
                      "Planchado"
                    )}
                    {componentesReporteDeArchivos(
                      reporteDeEntregado,
                      "Entregado"
                    )}
                  </div>
                </div>
                <p className="flex flex-row font-semibold text-xl justify-center mb-3">
                  Producción
                </p>
                <ReportesDeProduccion />
              </div>
            ) : (
              seEstanBuscandoReportes && (
                <div className="flex align-middle m-3 justify-center h-auto">
                  <p className="font-semibold text-lg">Cargando...</p>
                </div>
              )
            )}
          </DialogContent>
          <DialogActions>
            <Button variant="text" onClick={onClose}>
              Cerrar
            </Button>
          </DialogActions>
        </LoadingIndicator>
      </Dialog>
    </div>
  );
}
