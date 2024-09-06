import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { obtenerReporteDiseñoPorProcesoDesarrollo } from "@utils/queries/reportes/procesos/diseño";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import { DialogCargaReporteDeDisenio } from "./DialogCargaReporteDeDisenio";

type Props = {
  idProcesoDesarrollo: string;
};

export default function ReporteDeDisenio({ idProcesoDesarrollo }: Props) {
  const [showCargaReporte, setShowCargaReporte] = useState(false);
  const { addError } = useContext(ErrorHandlerContext);

  const { data: reporteDeDiseño, isFetching: seEstaBuscandoReporteDeDiseño } =
    useQuery(
      ["reporteDeDiseño", idProcesoDesarrollo],
      () => obtenerReporteDiseñoPorProcesoDesarrollo(idProcesoDesarrollo),
      {
        onError: () => addError("Error el reporte de diseño", "error"),
        refetchOnWindowFocus: false,
      }
    );

  function descargarReporteDisenio(comentario: string): void {
    const anchorComponent = document.createElement("a");
    const blob = new Blob([comentario], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    anchorComponent.href = url;
    anchorComponent.download = `Reporte_Diseño.txt`;
    anchorComponent.click();
  }

  return (
    <LoadingIndicator variant="blocking" show={seEstaBuscandoReporteDeDiseño}>
      <div className="m-4 text-gray-700 text-xl font-semibold">Resumen</div>

      <div className="flex flex-col">
        {reporteDeDiseño ? (
          <div className="m-4 border-4 shadow-lg min-h-[16rem] max-h-[20rem] flex p-4 flex-col space-y-2">
            <p>{reporteDeDiseño?.comentario}</p>
          </div>
        ) : (
          <p className="font-semibold self-center m-3">
            No hay reporte de diseño, carga uno!
          </p>
        )}
        <div className="flex flex-row justify-center">
          <Button
            variant="outlined"
            className="mr-4 text-xs w-1/5 self-center"
            onClick={() => setShowCargaReporte(true)}
          >
            {reporteDeDiseño ? "Editar reporte" : "Cargar reporte"}
          </Button>
          {reporteDeDiseño?.comentario && <Button
            variant="outlined"
            className="mr-4 text-xs w-1/5 self-center"
            onClick={() => descargarReporteDisenio(reporteDeDiseño?.comentario)}
            endIcon={<DownloadIcon />}
          >
            Descargar
          </Button>}
        </div>
      </div>

      {showCargaReporte && (
        <DialogCargaReporteDeDisenio
          onClose={() => setShowCargaReporte(false)}
          showCargaReporte={showCargaReporte}
          reporteDeDiseño={{
            ...reporteDeDiseño,
            idProcesoDesarrolloOrden: idProcesoDesarrollo,
          }}
        />
      )}
    </LoadingIndicator>
  );
}
