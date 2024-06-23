import FormItem from "@UI/Forms/FormItem";
import { LayoutElement } from "@UI/Forms/types";
import { ProcesoCorteMuestraSchemaType } from "@backend/schemas/reportes/ProcesoCorteMuestraSchema";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  titulo: string;
  onClose: () => void;
  layoutFormulario: LayoutElement<ProcesoCorteMuestraSchemaType>;
  open: boolean;
};

export function DialogCargaReporteCorteMuestra({
  titulo,
  onClose,
  layoutFormulario,
  open,
}: Props) {
  const { watch } = useFormContext<ProcesoCorteMuestraSchemaType>();
  const [disable, setDisable] = useState<boolean>();
  const datosDelReporte = watch();
  const tiposDeAvios = [
    {
      key: "Sin Especificar",
      text: "Sin Especificar",
    },
    {
      key: "Avio Simple",
      text: "Avio Simple",
    },
    {
      key: "Avio con Medida",
      text: "Avio con Medida",
    },
  ];

  useEffect(() => {
    const { nombre, cantidad, esAvio, tipoDeAvio } = datosDelReporte;

    if (
      nombre.trim() !== "" &&
      cantidad &&
      esAvio &&
      tipoDeAvio !== "Sin Especificar"
    ) {
      setDisable(false);
      return;
    } else if (
      nombre.trim() !== "" &&
      cantidad &&
      !esAvio &&
      tipoDeAvio === "Sin Especificar"
    ) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  }, [datosDelReporte]);

  return (
    <LoadingIndicator show={open}>
      <DialogTitle>{titulo}</DialogTitle>
      <DialogContent>
        <FormItem layout={layoutFormulario} selectOptions={{ tiposDeAvios }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" disabled={disable}>
          Confirmar
        </Button>
      </DialogActions>
    </LoadingIndicator>
  );
}
