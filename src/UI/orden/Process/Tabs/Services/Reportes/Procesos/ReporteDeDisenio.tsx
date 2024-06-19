import HookForm from "@UI/Forms/HookForm";

import { Button } from "@mui/material";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import {
  obtenerReporteDiseñoPorProcesoDesarrollo,
  cargarReporteDiseñoPorProcesoDesarrollo,
} from "@utils/queries/reportes/procesos/diseño";
import { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
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
        onError: () => addError("Error el reporte de diseño", "warning"),
        refetchOnWindowFocus: false,
      }
    );

  return (
    <LoadingIndicator variant="blocking" show={seEstaBuscandoReporteDeDiseño}>
      <div className="m-4 text-gray-700 text-xl font-semibold">Resumen</div>
      {reporteDeDiseño ? (
        <div className="m-4 border-4 shadow-lg min-h-[16rem] max-h-[20rem] flex p-4 flex-col space-y-2">
          <p>{reporteDeDiseño?.comentario}</p>
        </div>
      ) : (
        <div>
          <p>No hay reporte de diseño, carga uno!</p>
        </div>
      )}
      <Button
        variant="outlined"
        className="mr-4 text-xs"
        onClick={() => setShowCargaReporte(true)}
      >
        Editar reporte
      </Button>
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
