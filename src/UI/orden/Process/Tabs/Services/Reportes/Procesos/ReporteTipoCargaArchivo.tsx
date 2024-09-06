import { Button } from "@mui/material";
import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import { useMemo, useState } from "react";
import DialogCargaReporteDeArchivo from "./DialogCargaReporteDeArchivo";
import { useQuery } from "react-query";
import { obtenerReportesDeArchivosPorIdProcesoDesarrollo } from "@utils/queries/reportes/procesos/archivos";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import OrderImageItem from "../../../General/Files/OrderImageItem";
import OrderDownloadItem from "../../../General/Files/OrderDownloadItem";
type Props = {
  idProcesoDesarrollo: string;
  orderData: ExtendedOrdenData;
  idEstadoOrdenAPrevisualizar?: number;
};
export default function ReporteDeArchivo({
  idProcesoDesarrollo,
  orderData,
  idEstadoOrdenAPrevisualizar,
}: Props) {
  const [showCargaReporte, setShowCargaReprote] = useState<boolean>(false);
  const { idProceso } = useMemo(() => {
    if (idEstadoOrdenAPrevisualizar !== 0) {
      const procesosABuscar =
        idEstadoOrdenAPrevisualizar === 3
          ? orderData.procesosProductivos
          : orderData.procesos;

      return procesosABuscar.find((el) => el.id === idProcesoDesarrollo);
    }
    const procesosABuscar =
      orderData.idEstado === 3
        ? orderData.procesosProductivos
        : orderData.procesos;

    return procesosABuscar.find((el) => el.id === idProcesoDesarrollo);
  }, [idProcesoDesarrollo, orderData]);
  const laOrdenEstaEnProduccion = useMemo(
    () => (orderData?.idEstado === 3 && [0, 3].includes(idEstadoOrdenAPrevisualizar)),
    [orderData]
  );

  const {
    data: reportesDeArchivos,
    isFetching: seEstaBuscandoLosReportesDeArchivo,
    isRefetching: seEstaRecargandoLosReportesDeArchivo,
  } = useQuery(
    ["reportesArchivo", idProcesoDesarrollo],
    () =>
      obtenerReportesDeArchivosPorIdProcesoDesarrollo(
        idProcesoDesarrollo,
        laOrdenEstaEnProduccion
      ),
    { refetchOnWindowFocus: false }
  );

  const imagenes = reportesDeArchivos?.filter((reporteDeArchivo) =>
    reporteDeArchivo.type.includes("image")
  );
  const pdfs = reportesDeArchivos?.filter((reporteDeArchivo) =>
    reporteDeArchivo.type.includes("pdf")
  );
  const otros = reportesDeArchivos?.filter(
    (reporteDeArchivo) =>
      !reporteDeArchivo.type.includes("pdf") &&
      !reporteDeArchivo.type.includes("image")
  );

  return (
    <LoadingIndicator
      show={
        seEstaBuscandoLosReportesDeArchivo ||
        seEstaRecargandoLosReportesDeArchivo
      }
    >
      <div className="h-full border-2 flex justify-center items-center p-4">
        {idProceso && (
          <div className="flex flex-col space-y-4 items-center">
            <>
              <div>
                <p className="underline">Imagenes</p>
              </div>
              {imagenes && imagenes.length > 0 ? (
                imagenes.map((imagen) => (
                  <OrderImageItem archivo={imagen} key={imagen.id} />
                ))
              ) : (
                <p className="text-m font-semibold">No hay imagenes cargadas</p>
              )}
              <div>
                <p className="underline">{"PDF's"}</p>
              </div>
              {pdfs && pdfs.length > 0 ? (
                pdfs.map((pdf) => (
                  <OrderDownloadItem archivo={pdf} key={pdf.id} />
                ))
              ) : (
                <p className="text-m font-semibold">
                  No hay archivos PDF cargados
                </p>
              )}
              <div>
                <p className="underline">Otros</p>
              </div>
              {otros && otros.length > 0 ? (
                otros.map((otro) => (
                  <OrderDownloadItem archivo={otro} key={otro.id} />
                ))
              ) : (
                <p className="text-m font-semibold">No hay archivos cargados</p>
              )}
            </>
            <div>
              <Button
                variant="outlined"
                onClick={() => setShowCargaReprote(true)}
              >
                Subir nuevo reporte
              </Button>
            </div>
            {showCargaReporte && (
              <DialogCargaReporteDeArchivo
                onClose={() => setShowCargaReprote(false)}
                open={showCargaReporte}
                idProcesoDesarrolloOrden={idProcesoDesarrollo}
                orderData={orderData}
              />
            )}
          </div>
        )}
      </div>
    </LoadingIndicator>
  );
}
