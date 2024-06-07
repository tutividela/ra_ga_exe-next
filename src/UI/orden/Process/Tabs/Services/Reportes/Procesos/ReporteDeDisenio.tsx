import { ProcesoDisenioType } from "@backend/schemas/ProcesoDisenioSchema";
import { Button } from "@mui/material";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { obtenerReporteDiseñoPorProcesoDesarrollo } from "@utils/queries/reportes/procesos/diseño";
import { useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useQuery } from "react-query";

type Props = {
  idProcesoDesarrollo: string;
};

export default function ReporteDeDisenio({ idProcesoDesarrollo }: Props) {
  const [showCargaReporte, setShowCargaReporte] = useState(false);
  const { addError } = useContext(ErrorHandlerContext);
  const { watch } = useFormContext<ProcesoDisenioType>();
  const comentario = watch("comentario");
  const { data: reporteDeDiseño, isFetching: seEstaBuscandoReporteDiseño } =
    useQuery(
      ["reporteDeDiseño", idProcesoDesarrollo],
      () => obtenerReporteDiseñoPorProcesoDesarrollo(idProcesoDesarrollo),
      {
        onError: () => addError("Error el reporte de diseño"),
        refetchOnWindowFocus: false,
      }
    );

  return (
    <LoadingIndicator variant="blocking" show={seEstaBuscandoReporteDiseño}>
      <div className="m-4 text-gray-700 text-xl font-semibold">Resumen</div>
      <div className="m-4 border-4 shadow-lg min-h-[16rem] max-h-[20rem] overflow-y-scroll flex p-4 flex-col space-y-2">
        <p>{reporteDeDiseño?.comentario}</p>
      </div>
      <Button variant="outlined" className="mr-4 text-xs">
        Editar reporte
      </Button>
      {}
    </LoadingIndicator>
  );
}
