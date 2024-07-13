import { Button } from "@mui/material";
import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import { useMemo, useState } from "react";
import DialogCargaReporteDeArchivo from "./DialogCargaReporteDeArchivo";
import { useQuery } from "react-query";
import { obtenerReportesDeArchivosPorIdProcesoDesarrollo } from "@utils/queries/reportes/procesos/archivos";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import OrderImageItem from "../../../General/Files/OrderImageItem";
type Props = {
  idProcesoDesarrollo: string;
  orderData: ExtendedOrdenData;
};
export default function ReporteDeArchivo({
  idProcesoDesarrollo,
  orderData,
}: Props) {
  const [showCargaReporte, setShowCargaReprote] = useState<boolean>(false);
  const { idProceso } = useMemo(
    () => orderData?.procesos.find((el) => el.id === idProcesoDesarrollo),
    [idProcesoDesarrollo, orderData?.procesos]
  );

  const {
    data: reportesDeProcesoDesarrollo,
    isLoading: seEstaBuscandoLosReportesDeProcesoDesarrollo,
    isRefetching: seEstaRecargandoLosReportesDeProcesoDesarrollo,
  } = useQuery(["reportes-de-archivo"], () =>
    obtenerReportesDeArchivosPorIdProcesoDesarrollo(idProcesoDesarrollo)
  );

  const imagenes = reportesDeProcesoDesarrollo?.filter(
    (reporteDeProcesoDesarrollo) =>
      reporteDeProcesoDesarrollo.type.includes("image")
  );

  const pdfs = useMemo(
    () =>
      reportesDeProcesoDesarrollo?.filter((reporteDeProcesoDesarrollo) =>
        reporteDeProcesoDesarrollo.type.includes("pdf")
      ),
    [reportesDeProcesoDesarrollo]
  );

  const otros = useMemo(
    () =>
      reportesDeProcesoDesarrollo?.filter(
        (reporteDeProcesoDesarrollo) =>
          !reporteDeProcesoDesarrollo.type.includes("pdf") &&
          !reporteDeProcesoDesarrollo.type.includes("image")
      ),
    [reportesDeProcesoDesarrollo]
  );

  return (
    <LoadingIndicator
      show={
        seEstaBuscandoLosReportesDeProcesoDesarrollo ||
        seEstaRecargandoLosReportesDeProcesoDesarrollo
      }
    >
      <div className="h-full border-2 flex justify-center items-center p-4">
        <div className="flex flex-col space-y-4 items-center">
          {imagenes && [5, 2, 10, 11, 12, 13, 14, 15].includes(idProceso) && (
            <>
              <div>
                <p className="underline">Imagenes</p>
              </div>
              {imagenes.map((imagen) => (
                <OrderImageItem archivo={imagen} key={imagen.id} />
              ))}
              <div hidden={imagenes.length > 0}>
                <p className="text-m font-semibold">No hay imagenes cargadas</p>
              </div>
            </>
          )}
          {pdfs && [2, 3, 8, 10, 11, 12, 13, 14, 15].includes(idProceso) && (
            <>
              <div>
                <p className="underline">{"PDF's"}</p>
              </div>
              {pdfs.map((pdf) => (
                <OrderImageItem archivo={pdf} key={pdf.id} />
              ))}
              <div hidden={pdfs.length > 0}>
                <p className="text-m font-semibold">
                  No hay archivos PDF cargados
                </p>
              </div>
            </>
          )}
          {otros && (
            <>
              <div>
                <p className="underline">Otros</p>
              </div>
              {otros.map((otro) => (
                <OrderImageItem archivo={otro} key={otro.id} />
              ))}
              <div hidden={otros.length > 0}>
                <p className="text-m font-semibold">No hay archivos cargados</p>
              </div>
            </>
          )}
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
      </div>
    </LoadingIndicator>
  );
}
