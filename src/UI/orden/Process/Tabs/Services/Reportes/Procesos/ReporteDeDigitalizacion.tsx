import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import ReporteDeArchivo from "./ReporteTipoCargaArchivo";
import { useQuery } from "react-query";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import { useContext, useMemo } from "react";
import { obtenerReporteDigitalizacionPorProcesoDesarrollo } from "@utils/queries/reportes/procesos/digitalizacion";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";

type Props = {
  idProcesoDesarrollo: string;
  orderData: ExtendedOrdenData;
};
export function ReporteDeDigitalizacion({
  idProcesoDesarrollo,
  orderData,
}: Props) {
  const { addError } = useContext(ErrorHandlerContext);

  const {
    data: reporteDeDigitalizacion,
    isLoading: seEstaBuscandoReporteDeDigitalizacion,
  } = useQuery(
    ["reportes", idProcesoDesarrollo],
    () => obtenerReporteDigitalizacionPorProcesoDesarrollo(idProcesoDesarrollo),
    {
      onError: () => addError("Error al traer el reporte de Digitalizacion"),
    }
  );
  const columnas: GridColumns = useMemo(
    (): GridColumns => [
      {
        field: "cantidadDeMoldes",
        headerName: "Cantidad de Moldes",
        align: "center",
        headerAlign: "center",
      },
      {
        field: "cantidadDeTalles",
        headerName: "Cantidad de Talles",
        align: "center",
        headerAlign: "center",
      },
      {
        field: "cantidadDeAviosConMedida",
        headerName: "Cantidad de Avios con Medida",
        align: "center",
        headerAlign: "center",
      },
      {
        field: "cantidadDeMateriales",
        headerName: "Cantidad de Materiales",
        align: "center",
        headerAlign: "center",
      },
    ],
    []
  );

  return (
    <LoadingIndicator show={seEstaBuscandoReporteDeDigitalizacion}>
      <div className="flex flex-col mt-4">
        <ReporteDeArchivo
          idProcesoDesarrollo={idProcesoDesarrollo}
          orderData={orderData}
        />
        {reporteDeDigitalizacion && (
          <DataGrid columns={columnas} rows={[reporteDeDigitalizacion]} />
        )}
      </div>
    </LoadingIndicator>
  );
}
