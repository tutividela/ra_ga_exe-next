import FormItem from "@UI/Forms/FormItem";
import HookForm from "@UI/Forms/HookForm";
import { impresionLayout } from "@UI/Reportes/forms/impresion.layout";
import { ProcesoImpresionSchemaType } from "@backend/schemas/reportes/ProcesoImpresionSchema";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ReporteDeImpresion } from "@prisma/client";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { cargarReporteImpresionPorProcesoDesarrollo } from "@utils/queries/reportes/procesos/impresion";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";

type Props = {
  idProcesoDesarrollo: string;
  onClose: () => void;
  open: boolean;
  reporteActual: ReporteDeImpresion;
  handleCalcularPrecioProceso: () => Promise<void>
};

export function DialogCargaReporteImpresion({
  idProcesoDesarrollo,
  onClose,
  open,
  reporteActual,
  handleCalcularPrecioProceso,
}: Props) {
  const { addError } = useContext(ErrorHandlerContext);
  const queryClient = useQueryClient();
  const {
    mutateAsync: cargaReporteImpresionAsync,
    isLoading: seEstaCargandoReporteImpresion,
  } = useMutation(cargarReporteImpresionPorProcesoDesarrollo, {
    onError: () => addError("Error en la carga de la cantidad", "error"),
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["reportes", idProcesoDesarrollo]);
      addError("Se ha cargado el reporte con exito!", "success");
    },
  });
  const defaultLayoutValues: ProcesoImpresionSchemaType = {
    id: "",
    idProcesoDesarrolloOrden: idProcesoDesarrollo,
    cantidadDeMetros: 0,
  };

  async function handleSubmit(reporteDeImpresion: Partial<ReporteDeImpresion>): Promise<void> {
    await cargaReporteImpresionAsync(reporteDeImpresion);
    await handleCalcularPrecioProceso();
    queryClient.invalidateQueries(["order"]);
  }
  return (
    <Dialog open={open} fullWidth={true}>
      <LoadingIndicator
        variant="blocking"
        show={seEstaCargandoReporteImpresion}
      >
        <HookForm
          defaultValues={reporteActual ? reporteActual : defaultLayoutValues}
          onSubmit={handleSubmit}
        >
          <DialogTitle>Carga de cantidad impresa</DialogTitle>
          <DialogContent>
            <FormItem layout={impresionLayout} />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit">Confirmar</Button>
          </DialogActions>
        </HookForm>
      </LoadingIndicator>
    </Dialog>
  );
}
