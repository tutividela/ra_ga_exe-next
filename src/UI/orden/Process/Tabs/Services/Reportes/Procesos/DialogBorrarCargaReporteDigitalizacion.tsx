import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";

type Props = {
  open: boolean;
  onClose: () => void;
  handleBorrarCantidad: () => void;
};

export function DialogBorrarCargaReporteDigitalizacion({
  open,
  onClose,
  handleBorrarCantidad,
}: Props) {
  return (
    <Dialog open={open} fullWidth={true}>
      <DialogTitle>
        ¿Esta seguro de borrar las cantidades del reporte de Digitalizacion?
      </DialogTitle>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancelar</Button>
        <Button onClick={() => handleBorrarCantidad()}>Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
}
