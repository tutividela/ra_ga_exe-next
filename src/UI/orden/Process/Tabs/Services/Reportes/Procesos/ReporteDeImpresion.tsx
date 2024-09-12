import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import { ExtendedOrdenData } from "@utils/Examples/ExtendedOrdenData";
import {
  borrarReporteImpresionPorProcesoDesarrollo,
  obtenerReporteImpresionPorProcesoDesarrollo,
} from "@utils/queries/reportes/procesos/impresion";
import { useContext, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import { DialogCargaReporteImpresion } from "./DialogCargaReporteImpresion";
import { DialogBorrarCargaReporteImpresion } from "./DialogBorrarCargaReporteImpresion";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { actualizarPrecio } from "@utils/queries/procesos/procesos";

type Props = {
  idProcesoDesarrollo: string;
  orderData: ExtendedOrdenData;
};

export function ReporteDeImpresion({ idProcesoDesarrollo, orderData }: Props) {
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
    data: reporteDeImpresion,
    isLoading: seEstaBuscandoReporteDeImpresion,
  } = useQuery(
    ["reportes", idProcesoDesarrollo],
    () => obtenerReporteImpresionPorProcesoDesarrollo(idProcesoDesarrollo),
    {
      onError: () => addError("Error al traer el reporte de Digitalizacion"),
    }
  );

  const { proceso: nombreDeProceso } = useMemo(
    () =>
      orderData.procesos.find((proceso) => proceso.id === idProcesoDesarrollo),
    [idProcesoDesarrollo]
  );

  const {
    mutateAsync: borrarReporteImpresionAsync,
    isLoading: seEstaBorrandoReporteImpresion,
  } = useMutation(borrarReporteImpresionPorProcesoDesarrollo, {
    onError: () =>
      addError("Error en la eliminacion de las cantidades", "error"),
    onSuccess: () => {
      queryClient.invalidateQueries(["reportes", idProcesoDesarrollo]);
      addError("Se ha eliminado el reporte con exito!", "success");
    },
  });

  async function onHandleBorrarReporteImpresion(): Promise<void> {
    setShowBorrarCargaDeCantidades(false);
    await borrarReporteImpresionAsync(reporteDeImpresion?.id);
    await actualizarPrecio({
      emailDePrestador: "",
      idProceso: procesoDesarrollo?.idProceso,
      idProcesoDesarrollo,
      precioPrendaBase: orderData?.prenda.precioBase,
      esDeProduccion: false,
    });
    queryClient.invalidateQueries(["order"]);
  }

  async function onHandleCalcularPrecioProceso(): Promise<void> {
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
      field: "nombreDeProceso",
      headerName: "Proceso",
      width: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "cantidadDeMetros",
      headerName: "Cantidad de metros impresos",
      width: 250,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "acciones",
      headerName: "Acciones",
      width: 100,
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: () => (
        <DeleteIcon onClick={() => setShowBorrarCargaDeCantidades(true)} />
      ),
    },
  ];
  return (
    <LoadingIndicator
      show={seEstaBuscandoReporteDeImpresion || seEstaBorrandoReporteImpresion}
    >
      <div
        style={{
          height: 250,
          width: "100%",
          borderWidth: 2,
          marginTop: 10,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {reporteDeImpresion && (
          <DataGrid
            columns={columns || []}
            rows={[{ ...reporteDeImpresion, nombreDeProceso }] || []}
            pageSize={1}
            className="m-2"
          />
        )}
        {!reporteDeImpresion && (
          <div className="flex flex-col">
            <p className="font-semibold text-base self-center">
              No se ha cargado los metros impresos
            </p>
          </div>
        )}
        <div className="self-center m-3">
          <Button
            variant="outlined"
            onClick={() => setShowCargaDeCantidades(true)}
          >
            {reporteDeImpresion ? "Editar cantidad" : "Cargar cantidad"}
          </Button>
        </div>
        {showCargaDeCantidades && (
          <DialogCargaReporteImpresion
            idProcesoDesarrollo={idProcesoDesarrollo}
            onClose={() => setShowCargaDeCantidades(false)}
            open={showCargaDeCantidades}
            reporteActual={reporteDeImpresion}
            handleCalcularPrecioProceso={onHandleCalcularPrecioProceso}
          />
        )}
        {showBorrarCargaDeCantidades && (
          <DialogBorrarCargaReporteImpresion
            open={showBorrarCargaDeCantidades}
            onClose={() => setShowBorrarCargaDeCantidades(false)}
            handleBorrarCantidad={async () => {
              await onHandleBorrarReporteImpresion();
            }}
          />
        )}
      </div>
    </LoadingIndicator>
  );
}
