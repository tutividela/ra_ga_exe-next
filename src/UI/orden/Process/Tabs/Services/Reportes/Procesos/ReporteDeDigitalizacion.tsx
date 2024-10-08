import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import ReporteDeArchivo from "./ReporteTipoCargaArchivo";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import { useContext, useState } from "react";
import {
  borrarReporteDigitalizacionPorProcesoDesarrollo,
  obtenerReporteDigitalizacionPorProcesoDesarrollo,
} from "@utils/queries/reportes/procesos/digitalizacion";
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport } from "@mui/x-data-grid";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { Button } from "@mui/material";
import { DialogCargaReporteDigitalizacion } from "./DialogCargaReporteDigitalizacion";
import DeleteIcon from "@mui/icons-material/Delete";
import { DialogBorrarCargaReporteDigitalizacion } from "./DialogBorrarCargaReporteDigitalizacion";
import { actualizarPrecio } from "@utils/queries/procesos/procesos";

type Props = {
  idProcesoDesarrollo: string;
  orderData: ExtendedOrdenData;
};
export function ReporteDeDigitalizacion({
  idProcesoDesarrollo,
  orderData,
}: Props) {
  const { addError } = useContext(ErrorHandlerContext);
  const queryClient = useQueryClient();
  const [showCargaDeCantidades, setShowCargaDeCantidades] =
    useState<boolean>(false);
  const [showBorrarCargaDeCantidades, setShowBorrarCargaDeCantidades] =
    useState<boolean>(false);
  const procesoDesarrollo = orderData?.procesos.find(
    (proceso) => proceso.id === idProcesoDesarrollo
  );

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

  const {
    mutateAsync: borrarReporteDigitalizacionAsync,
    isLoading: seEstaBorrandoReporteDigitalizacion,
  } = useMutation(borrarReporteDigitalizacionPorProcesoDesarrollo, {
    onError: () =>
      addError("Error en la eliminacion de las cantidades", "error"),
    onSuccess: () => {
      queryClient.invalidateQueries(["reportes", idProcesoDesarrollo]);
      addError("Se ha eliminado el reporte con exito!", "success");
    },
  });

  async function onHandleBorrarReporteDigitalizacion(): Promise<void> {
    setShowBorrarCargaDeCantidades(false);
    await borrarReporteDigitalizacionAsync(reporteDeDigitalizacion?.id);
    await actualizarPrecio({
      emailDePrestador: "",
      idProceso: procesoDesarrollo?.idProceso,
      idProcesoDesarrollo,
      precioPrendaBase: orderData?.prenda.precioBase,
      esDeProduccion: false,
    });
    queryClient.invalidateQueries(["order"]);
  }

  async function onHandleCalcularPrecioProceso() {
    await actualizarPrecio({
      emailDePrestador: "",
      idProceso: procesoDesarrollo?.idProceso,
      idProcesoDesarrollo,
      precioPrendaBase: orderData?.prenda.precioBase,
      esDeProduccion: false,
    });
  }

  const columns: GridColDef[] = [
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
    {
      field: "acciones",
      headerName: "Acciones",
      width: 100,
      align: "center",
      renderCell: () => (
        <DeleteIcon onClick={() => setShowBorrarCargaDeCantidades(true)} />
      ),
    },
  ];

  return (
    <div className="mt-4">
      <LoadingIndicator
        show={
          seEstaBuscandoReporteDeDigitalizacion ||
          seEstaBorrandoReporteDigitalizacion
        }
      >
        <ReporteDeArchivo
          idProcesoDesarrollo={idProcesoDesarrollo}
          orderData={orderData}
        />
        <div
          style={{
            height: 280,
            width: "100%",
            borderWidth: 2,
            marginTop: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {reporteDeDigitalizacion && (
            <DataGrid
              columns={columns || []}
              rows={[reporteDeDigitalizacion]}
              pageSize={1}
              components={{
                Toolbar: () => (
                  <GridToolbarContainer>
                    <GridToolbarExport />
                  </GridToolbarContainer>
                ),
              }}
            />
          )}
          {!reporteDeDigitalizacion && (
            <div className="flex flex-col">
              <p className="font-semibold text-base self-center">
                No se ha cargado las cantidades de moldes, talles, materiales,
                avios asociados a la Digitalizacion
              </p>
            </div>
          )}
          <div className="self-center m-3">
            <Button
              variant="outlined"
              onClick={() => setShowCargaDeCantidades(true)}
            >
              {reporteDeDigitalizacion
                ? "Editar cantidades"
                : "Cargar cantidades"}
            </Button>
          </div>
          {showCargaDeCantidades && (
            <DialogCargaReporteDigitalizacion
              idProcesoDesarrollo={idProcesoDesarrollo}
              onClose={() => setShowCargaDeCantidades(false)}
              open={showCargaDeCantidades}
              reporteActual={reporteDeDigitalizacion}
              handleCalcularPrecioProceso={onHandleCalcularPrecioProceso}
            />
          )}
          {showBorrarCargaDeCantidades && (
            <DialogBorrarCargaReporteDigitalizacion
              open={showBorrarCargaDeCantidades}
              onClose={() => setShowBorrarCargaDeCantidades(false)}
              handleBorrarCantidad={async () => {
                await onHandleBorrarReporteDigitalizacion();
              }}
            />
          )}
        </div>
      </LoadingIndicator>
    </div>
  );
}
