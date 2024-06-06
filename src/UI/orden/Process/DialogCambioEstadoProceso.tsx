import FormItem from "@UI/Forms/FormItem";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { processItemChangeLayout } from "../forms/processItemChange.layout";
import { useFormContext } from "react-hook-form";

type Props = {
  open: boolean;
  onClose: () => void;
  states: {
    key: string;
    text: string;
  }[];
  habilitarCambioEstado: (estadoActual: string) => boolean;
};

export default function DialogCambioEstadoProceso({
  onClose,
  states,
  habilitarCambioEstado,
}: Props) {
  const { watch } = useFormContext();
  const estadoProcesoDesarrolloActual = watch("estado");
  const habilitado = habilitarCambioEstado(estadoProcesoDesarrolloActual);

  return (
    <div className="p-4">
      <DialogTitle>{"Cambiar el estado para el proceso?"}</DialogTitle>
      <div className="my-4 mx-4">
        <FormItem layout={processItemChangeLayout} selectOptions={{ states }} />
      </div>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Confirme para cambiar el estado del proceso
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={habilitado}>
          Confirmar
        </Button>
      </DialogActions>
    </div>
  );
}
