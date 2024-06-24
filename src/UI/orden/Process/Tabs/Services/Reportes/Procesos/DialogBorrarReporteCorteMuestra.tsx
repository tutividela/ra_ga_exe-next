import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

type Props = {
  titulo: string;
  open: boolean;
  onClose: () => void;
  handleBorrarCantidad: () => void;
};

export function DialogBorrarReporteCorteMuestra({
  titulo,
  open,
  onClose,
  handleBorrarCantidad,
}: Props) {
  return (
    <Dialog open={open} fullWidth={true}>
      <DialogTitle>{titulo}</DialogTitle>
      <DialogActions>
        <Button onClick={() => onClose()}>Cancelar</Button>
        <Button onClick={() => handleBorrarCantidad()}>Confirmar</Button>
      </DialogActions>
    </Dialog>
  );
}
