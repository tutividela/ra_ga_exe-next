import FormItem from "@UI/Forms/FormItem";
import HookForm from "@UI/Forms/HookForm";
import { LayoutElement } from "@UI/Forms/types";
import { ProcesoCorteMuestraSchemaType } from "@backend/schemas/reportes/ProcesoCorteMuestraSchema";
import { ProcesoDigitalizacionType } from "@backend/schemas/reportes/ProcesoDigitalizacionSchema";
import { ProcesoDisenioType } from "@backend/schemas/reportes/ProcesoDisenioSchema";
import { ProcesoImpresionSchemaType } from "@backend/schemas/reportes/ProcesoImpresionSchema";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { cargarReporteCorteMuestraPorProcesoDesarrollo } from "@utils/queries/reportes/procesos/corteMuestra";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";

type Model =
  | ProcesoImpresionSchemaType
  | ProcesoDigitalizacionType
  | ProcesoDisenioType
  | ProcesoCorteMuestraSchemaType;

type Props = {
  titulo: string;
  open: boolean;
  onClose: () => void;
  layoutFormulario: LayoutElement<Model>;
  defaultLayoutFormulario: any;
};

export function DialogCargaReporte({
  titulo,
  open,
  onClose,
  layoutFormulario,
  defaultLayoutFormulario,
}: Props) {
  const { addError } = useContext(ErrorHandlerContext);
  const queryClient = useQueryClient();

  const {
    mutateAsync: cargaReporteCorteMuestraAsync,
    isLoading: seEstaCargandoReporteCorteMuestra,
  } = useMutation(cargarReporteCorteMuestraPorProcesoDesarrollo, {
    onError: () => addError("Error en la carga de las cantidades", "error"),
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["reportes-corte-muestra"]);
      addError("Se ha cargado el reporte con exito!", "success");
    },
  });
  const tiposDeAvios = [
    {
      key: "Avio Simple",
      text: "Avio Simple",
    },
    {
      key: "Avio con Medida",
      text: "Avio con Medida",
    },
  ];
  return (
    <LoadingIndicator show={seEstaCargandoReporteCorteMuestra}>
      <Dialog open={open}>
        <HookForm
          defaultValues={defaultLayoutFormulario}
          onSubmit={cargaReporteCorteMuestraAsync}
        >
          <DialogTitle>{titulo}</DialogTitle>
          <DialogContent>
            <FormItem
              layout={layoutFormulario}
              selectOptions={{ tiposDeAvios }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit">Confirmar</Button>
          </DialogActions>
        </HookForm>
      </Dialog>
    </LoadingIndicator>
  );
}
