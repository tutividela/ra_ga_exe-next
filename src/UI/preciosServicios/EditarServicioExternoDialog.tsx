import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import FormItem from "@UI/Forms/FormItem";
import HookForm from "@UI/Forms/HookForm";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { editarServicioExternoLayout } from "./form/EditarServicioExternoLayout";
import { useMutation, useQueryClient } from "react-query";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import { useContext } from "react";
import { modificarServicioExterno } from "@utils/queries/cotizador";

type Props = {
  open: boolean;
  onClose: () => void;
  defaultLayout: { id: string; factorMultiplicador: number };
};

export function EditarServicioExternoDialog({
  open,
  onClose,
  defaultLayout,
}: Props) {
  const { addError } = useContext(ErrorHandlerContext);
  const queryClient = useQueryClient();

  const {
    mutateAsync: modificarServicioExternoAsync,
    isLoading: seEstaEditandoServicioExterno,
  } = useMutation(modificarServicioExterno, {
    onSuccess: () => {
      queryClient.invalidateQueries(["servicios-externos"]);
      onClose();
      addError("Se ha editado el servicio con exito!", "info");
    },
    onError: () => {
      onClose();
      addError(
        "Ha ocurrido un error en la edicion del servicio externo",
        "error"
      );
    },
  });
  return (
    <div>
      <Dialog open={open} onClose={onClose} fullWidth={true}>
        <DialogTitle>Editar servicio externo</DialogTitle>
        <LoadingIndicator show={seEstaEditandoServicioExterno}>
          <HookForm
            defaultValues={defaultLayout}
            onSubmit={modificarServicioExternoAsync}
          >
            <DialogContent>
              <FormItem layout={editarServicioExternoLayout} />
            </DialogContent>
            <DialogActions>
              <Button type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Confirmar</Button>
            </DialogActions>
          </HookForm>
        </LoadingIndicator>
      </Dialog>
    </div>
  );
}
