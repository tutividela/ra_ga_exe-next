import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
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
      width: 150,
      align: "center",
    },
    {
      field: "cantidad",
      headerName: "Consumo",
      width: 220,
      align: "center",
    },
    {
      field: "esAvio",
      headerName: "¿Es Avio?",
      width: 150,
      align: "center",
    },
    {
      field: "tipoDeAvio",
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
      <div className="flex flex-col">
        <p>Diseño</p>
        <div className="m-4 border-4 shadow-lg min-h-[16rem] max-h-[20rem] flex p-4 flex-col space-y-2">
          {reporteDeDiseño}
        </div>
      </div>
    ) : (
      <p className="text-sm">No hay reporte de Diseño</p>
    );
  const ReporteDeDigitalizacion = () => (
    <div className="flex flex-col">
      <p>Digitalizacion y Progresiones</p>
      <div>
        {reporteDeDigitalizacion ? (
          <DataGrid
            columns={columnasReporteDigitalizacion}
            rows={reporteDeDigitalizacion ? [reporteDeDigitalizacion] : []}
            pageSize={1}
            className="h-52"
          />
        ) : (
          <p>
            No hay cantidades de Moldes, Avios con medida, Talles y Materiales
            cargadas
          </p>
        )}
      </div>
      <div className="">
        {archivosDeReporteDigitalizacion.length > 0 ? (
          archivosDeReporteDigitalizacion.map((reporte) => (
            <OrderImageItem archivo={reporte} key={reporte.id} />
          ))
        ) : (
          <p>No hay reportes de archivo para Digitalizacion y Progresiones</p>
        )}
      </div>
    </div>
  );
  const ReporteDeImpresion = () => (
    <div>
      <p>Impresion</p>
      {reporteDeImpresion ? (
        <div className="flex flex-col">
          <div>
            <DataGrid
              columns={columnasReporteImpresion}
              rows={reporteDeImpresion ? [reporteDeImpresion] : []}
              pageSize={1}
              className="h-52"
            />
          </div>
        </div>
      ) : (
        <p>No hay reporte de Impresion</p>
      )}
    </div>
  );
  function componentesReporteDeArchivos(
    reportesDeArchivos: ReporteArchivo[],
    proceso: string
  ) {
    return (
      <div>
        <p>{proceso}</p>
        {reportesDeArchivos.length > 0 ? (
          <div className="flex flex-col">
            {reportesDeArchivos.map((reporte) => (
              <OrderImageItem archivo={reporte} key={reporte.id} />
            ))}
          </div>
        ) : (
          <div>
            <p>No hay archivos de reporte para el proceso {proceso}</p>
          </div>
        )}
      </div>
    );
  }
  const ReporteDeCorteMuestra = () => (
    <div className="flex flex-col">
      <p>Corte Muestra</p>
      <div>
        {reporteDeCorteMuestra.length > 0 ? (
          <DataGrid
            columns={columnasReporteCorteMuestra}
            rows={reporteDeCorteMuestra ? reporteDeCorteMuestra : []}
            pageSize={5}
            className="h-96"
          />
        ) : (
          <p>No hay partes cargadas</p>
        )}
      </div>
    </div>
  );
  const ReportesDeProduccion = () => {
    return laOrdenPuedeTenerUnaProduccion ? (
      reportes?.produccion.lenght > 0 ? (
        reportes.produccion.map((reporte, index) => (
          <div key={index}>
            <p>{reporte.nombre}</p>
            {reporte.reportesDeArchivo.map((archivo) => (
              <OrderImageItem archivo={archivo} key={archivo.id} />
            ))}
          </div>
        ))
      ) : (
        <p>No hay reportes de produccion cargados aun</p>
      )
    ) : (
      <p>La orden no tiene reportes de produccion</p>
    );
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
                  {componentesReporteDeArchivos(reporteDeMolderia, "Molderia")}
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
                Produccion
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
  );
}
