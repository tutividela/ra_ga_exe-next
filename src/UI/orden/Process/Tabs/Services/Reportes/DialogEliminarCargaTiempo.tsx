import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { eliminarCargaDeTiempoPorId } from "@utils/queries/registros";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";

type Props = {
  open: boolean;
  onClose: () => void;
  idCargaTiempo: string;
};

export default function DialogEliminarCargaTiempo({
  open,
  onClose,
  idCargaTiempo,
}: Props) {
  const { addError } = useContext(ErrorHandlerContext);
  const queryClient = useQueryClient();

  const {
    mutateAsync: eliminarTiempoAsync,
    isLoading: seEstaEliminandoUnaCargaDeTiempo,
  } = useMutation(eliminarCargaDeTiempoPorId, {
    onError: (error) => addError(JSON.stringify(error), "error"),
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["cargasDeTiempo"]);
      addError("Se ha eliminado la carga de tiempo tiempo con exito!", "info");
    },
  });

  async function handleEliminarCargaTiempo() {
    await eliminarTiempoAsync(idCargaTiempo);
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true}>
      <LoadingIndicator
        variant="blocking"
        show={seEstaEliminandoUnaCargaDeTiempo}
      >
        <DialogTitle id="alert-dialog-title">
          ¿Esta seguro de eliminar esta carga de tiempo?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleEliminarCargaTiempo}>Si</Button>
          <Button onClick={onClose} autoFocus>
            No
          </Button>
        </DialogActions>
      </LoadingIndicator>
    </Dialog>
  );
}
