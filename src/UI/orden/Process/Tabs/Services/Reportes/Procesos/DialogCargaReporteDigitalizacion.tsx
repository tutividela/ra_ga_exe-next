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
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";

type Props = {
  open: boolean;
  onClose: () => void;
  idProcesoDesarrollo: string;
};

export function DialogCargaReporteDigitalizacion({
  open,
  onClose,
  idProcesoDesarrollo,
}: Props) {
  const defaultLayoutValues: Partial<ReporteDeDigitalizacion> = {
    cantidadDeAviosConMedida: 0,
    cantidadDeMateriales: 0,
    cantidadDeTalles: 0,
    cantidadDeMoldes: 0,
    idProcesoDesarrolloOrden: idProcesoDesarrollo,
  };

  return (
    <Dialog open={open} fullWidth={true}>
      <LoadingIndicator variant="blocking" show={false}>
        <HookForm
          defaultValues={defaultLayoutValues}
          onSubmit={() => console.log("hola")}
        >
          <DialogTitle>Carga de cantidades de la Digitalizacion</DialogTitle>
          <DialogContent className="w-auto">
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
