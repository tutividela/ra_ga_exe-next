import FormItem from "@UI/Forms/FormItem";
import HookForm from "@UI/Forms/HookForm";
import { digitalizacionLayout } from "@UI/Reportes/forms/digitalizacion.layout";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ReporteDeDigitalizacion } from "@prisma/client";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { cargarReporteDigitalizacionPorProcesoDesarrollo } from "@utils/queries/reportes/procesos/digitalizacion";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";

type Props = {
  open: boolean;
  onClose: () => void;
  idProcesoDesarrollo: string;
  reporteActual?: ReporteDeDigitalizacion | null;
  handleCalcularPrecioProceso: () => Promise<void>;
};

export function DialogCargaReporteDigitalizacion({
  open,
  onClose,
  idProcesoDesarrollo,
  reporteActual,
  handleCalcularPrecioProceso,
}: Props) {
  const defaultLayoutValues: Partial<ReporteDeDigitalizacion> = {
    cantidadDeAviosConMedida: 0,
    cantidadDeMateriales: 0,
    cantidadDeTalles: 0,
    cantidadDeMoldes: 0,
    idProcesoDesarrolloOrden: idProcesoDesarrollo,
  };
  const { addError } = useContext(ErrorHandlerContext);
  const queryClient = useQueryClient();
  const {
    mutateAsync: cargaReporteDigitalizacionAsync,
    isLoading: seEstaCargandoReporteDigitalizacion,
  } = useMutation(cargarReporteDigitalizacionPorProcesoDesarrollo, {
    onError: () => addError("Error en la carga de las cantidades", "error"),
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["order"]);
      addError("Se ha cargado el reporte con exito!", "success");
    },
  });

  async function handleSubmit(data: ReporteDeDigitalizacion) {
    await cargaReporteDigitalizacionAsync(data);
    await handleCalcularPrecioProceso();
  }

  return (
    <Dialog open={open} fullWidth={true}>
      <LoadingIndicator
        variant="blocking"
        show={seEstaCargandoReporteDigitalizacion}
      >
        <HookForm
          defaultValues={reporteActual ? reporteActual : defaultLayoutValues}
          onSubmit={handleSubmit}
        >
          <DialogTitle>Carga de cantidades de la Digitalizacion</DialogTitle>
          <DialogContent>
            <FormItem layout={digitalizacionLayout} />
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
