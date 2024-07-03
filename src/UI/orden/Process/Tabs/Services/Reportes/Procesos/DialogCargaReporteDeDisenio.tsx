import FormItem from "@UI/Forms/FormItem";
import HookForm from "@UI/Forms/HookForm";
import { disenioLayout } from "@UI/Reportes/forms/disenio.layout";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ReporteDeDisenio } from "@prisma/client";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { cargarReporteDiseñoPorProcesoDesarrollo } from "@utils/queries/reportes/procesos/diseño";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";

type Props = {
  showCargaReporte: boolean;
  onClose: () => void;
  reporteDeDiseño: ReporteDeDisenio;
};

export function DialogCargaReporteDeDisenio({
  showCargaReporte,
  onClose,
  reporteDeDiseño,
}: Props) {
  const { addError } = useContext(ErrorHandlerContext);
  const queryClient = useQueryClient();
  const { mutateAsync: cargarReporteAsync, isLoading: seEstaCargadoReporte } =
    useMutation(cargarReporteDiseñoPorProcesoDesarrollo, {
      onSuccess: () => {
        queryClient.invalidateQueries(["reporteDeDiseño"]);
        queryClient.invalidateQueries(["reportes-datos-numericos"]);
        addError("Se ha cargado el resumen de diseño con exito!", "info");
        onClose();
      },
      onError: () => addError("Error el reporte de diseño", "error"),
    });

  return (
    <Dialog open={showCargaReporte} fullWidth={true}>
      <LoadingIndicator variant="blocking" show={seEstaCargadoReporte}>
        <HookForm defaultValues={reporteDeDiseño} onSubmit={cargarReporteAsync}>
          <DialogTitle>Carga de Resumen de Diseño</DialogTitle>
          <DialogContent className="w-auto">
            <FormItem layout={disenioLayout} />
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
