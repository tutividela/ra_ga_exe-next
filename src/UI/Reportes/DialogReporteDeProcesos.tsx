import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ReporteArchivo, ReporteDeDigitalizacion } from "@prisma/client";
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

  const reporteDeDiseño =
    (reportes?.disenio.find((reporte) => reporte.idProceso === 1)
      ?.reportesDeDisenio?.comentario as string) || "";
  const reporteDeMolderia = reportes?.disenio.find(
    (reporte) => reporte.idProceso === 2
  )?.reportesDeArchivo as ReporteArchivo[];
  const reporteDeDigitalizacion =
    (reportes?.disenio.find((reporte) => reporte.idProceso === 3)
      ?.reportesDeDigitalizacion as ReporteDeDigitalizacion) || null;

  const ReporteDeDiseño = () => (
    <div className="m-4 border-4 shadow-lg min-h-[16rem] max-h-[20rem] flex p-4 flex-col space-y-2">
      {reporteDeDiseño}
    </div>
  );
  const ReporteDeMolderia = () => (
    <>
      {reporteDeMolderia.map((reporte) => (
        <OrderImageItem archivo={reporte} key={reporte.id} />
      ))}
    </>
  );
  const ReporteDeDigitalizacion = () => (
    <div
      style={{
        height: 500,
        width: 500,
      }}
    >
      <DataGrid
        columns={columnasReporteDigitalizacion}
        rows={reporteDeDigitalizacion ? [reporteDeDigitalizacion] : []}
        pageSize={1}
        className="m-2"
      />
    </div>
  );

  const laOrdenEstaEnProduccion = reportes?.idEstado === 3 || false;

  return (
    <Dialog open={open} onClose={onClose}>
      <LoadingIndicator show={seEstanBuscandoReportes}>
        <DialogContent>
          <p className="flex flex-row font-semibold text-xl justify-center mb-3">
            Diseño/Desarrollo
          </p>
          {reportes ? (
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
                <ReporteDeDiseño />
                <ReporteDeMolderia />
                <ReporteDeDigitalizacion />
              </div>
            </>
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
