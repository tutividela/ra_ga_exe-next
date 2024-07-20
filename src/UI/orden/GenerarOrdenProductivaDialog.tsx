import { OrdenProductivaSchemaDTOType } from "@backend/schemas/OrdenProductivaDTOSchema";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import FormItem from "@UI/Forms/FormItem";
import HookForm from "@UI/Forms/HookForm";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { generarOrdenProductivaLayout } from "./forms/generarOrdenProductiva.layout";
import { useState } from "react";
import { calcularOrdenProductiva } from "@utils/queries/order";

type Props = {
  open: boolean;
  onClose: () => void;
  idOrden: string;
  precioPrendaBase: number;
};

export function GenerarOrdenProductivaDialog({
  open,
  onClose,
  idOrden,
  precioPrendaBase,
}: Props) {
  //calcularOrdenProductiva
  const [precioEstimado, setPrecioEstimado] = useState<number>(0);
  const [seEstaCalculandoPrecioEstimado, setSeEstaCalculandoPrecioEstimado] =
    useState<boolean>(false);
  const [seCalculoPrecioEstimado, setSeCalculoPrecioEstimado] =
    useState<boolean>(false);
  const layout = {
    idOrden: idOrden,
    cantidad: 1,
    precioEstimado: precioEstimado,
  };

  async function handleSubmit(data) {
    setSeEstaCalculandoPrecioEstimado(true);
    const { precio } = await calcularOrdenProductiva(
      data.cantidad,
      precioPrendaBase
    );
    setPrecioEstimado(precio);
    setSeEstaCalculandoPrecioEstimado(false);
  }

  return (
    <Dialog open={open}>
      <LoadingIndicator show={seEstaCalculandoPrecioEstimado}>
        <DialogTitle>Generar una produccion</DialogTitle>
        <Alert severity="info" className="mx-3">
          Especifique una cantidad a producir y verifique el precio aproximado
          de la produccion
        </Alert>
        <HookForm defaultValues={layout} onSubmit={handleSubmit}>
          <DialogContent>
            <FormItem layout={generarOrdenProductivaLayout} />
            <p className="text-gray-500 text-xl font-semibold">
              Precio aproximado: {precioEstimado.toFixed(2)} $
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit">
              {!seCalculoPrecioEstimado ? "Calcular" : "Confirmar"}
            </Button>
          </DialogActions>
        </HookForm>
      </LoadingIndicator>
    </Dialog>
  );
}
