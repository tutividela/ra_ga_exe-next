import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import ReporteDeArchivo from "./ReporteTipoCargaArchivo";
import { useQuery } from "react-query";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import { useContext, useMemo, useState } from "react";
import { obtenerReporteDigitalizacionPorProcesoDesarrollo } from "@utils/queries/reportes/procesos/digitalizacion";
import { DataGrid, GridColDef, GridColumns } from "@mui/x-data-grid";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { Button } from "@mui/material";
import { DialogCargaReporteDigitalizacion } from "./DialogCargaReporteDigitalizacion";

type Props = {
  idProcesoDesarrollo: string;
  orderData: ExtendedOrdenData;
};
export function ReporteDeDigitalizacion({
  idProcesoDesarrollo,
  orderData,
}: Props) {
  const { addError } = useContext(ErrorHandlerContext);
  const [showCargaDeCantidades, setShowCargaDeCantidades] =
    useState<boolean>(false);

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

  const columns: GridColDef[] = [
    {
      field: "cantidadDeMoldes",
      headerName: "Cantidad de Moldes",
      width: 150,
      editable: true,
    },
    {
      field: "cantidadDeAviosConMedida",
      headerName: "Cantidad de Avios con Medida",
      width: 150,
      editable: true,
    },
    {
      field: "cantidadDeTalles",
      headerName: "Cantidad de Talles",
      width: 150,
      editable: true,
    },
    {
      field: "cantidadDeMateriales",
      headerName: "Cantidad de Materiales",
      type: "number",
      width: 110,
      editable: true,
    },
  ];

  return (
    <div className="mt-4">
      <LoadingIndicator show={seEstaBuscandoReporteDeDigitalizacion}>
        <ReporteDeArchivo
          idProcesoDesarrollo={idProcesoDesarrollo}
          orderData={orderData}
        />
        <div
          style={{
            height: 200,
            width: "100%",
            borderWidth: 2,
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {reporteDeDigitalizacion && (
            <DataGrid
              columns={columns || []}
              rows={[reporteDeDigitalizacion] || []}
              pageSize={1}
              className="mt-2"
            />
          )}
          {!reporteDeDigitalizacion && (
            <div className="flex flex-col">
              <p className="font-semibold text-base self-center">
                No se ha cargado las cantidades de moldes, talles, materiales,
                avios asociados a la Digitalizacion
              </p>
              <div className="self-center m-3">
                <Button
                  variant="outlined"
                  onClick={() => setShowCargaDeCantidades(true)}
                >
                  Cargar cantidades
                </Button>
              </div>
            </div>
          )}
          {showCargaDeCantidades && (
            <DialogCargaReporteDigitalizacion
              idProcesoDesarrollo={idProcesoDesarrollo}
              onClose={() => setShowCargaDeCantidades(false)}
              open={showCargaDeCantidades}
            />
          )}
        </div>
      </LoadingIndicator>
    </div>
  );
}
