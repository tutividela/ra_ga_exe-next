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
import { useContext, useState } from "react";
import {
  calcularOrdenProductiva,
  generarOrdenProductiva,
} from "@utils/queries/order";
import { useMutation, useQueryClient } from "react-query";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";

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
  const queryClient = useQueryClient();
  const { addError } = useContext(ErrorHandlerContext);
  const [precioEstimado, setPrecioEstimado] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(1);
  const [seEstaCalculandoPrecioEstimado, setSeEstaCalculandoPrecioEstimado] =
    useState<boolean>(false);
  const [seCalculoPrecioEstimado, setSeCalculoPrecioEstimado] =
    useState<boolean>(false);
  const layout = {
    idOrden: idOrden,
    cantidad: cantidad,
    precioEstimado: precioEstimado,
  };

  const {
    mutateAsync: generarOrdenProductivaAsync,
    isLoading: seEstaGenerandoOrdenProductiva,
  } = useMutation(generarOrdenProductiva, {
    onSuccess: () => {
      addError("Se ha generado la orden productiva!", "success");
      onClose();
      queryClient.invalidateQueries(["order"]);
    },
    onError: () => {
      addError(
        "A ocurrido un error con la generacion de la orden productiva",
        "error"
      );
      onClose();
    },
  });
  /* const {
    mutateAsync: calcularOrdenProductivaAsync,
    isLoading: seEstaCalculandoOrdenProductiva,
  } = useMutation(calcularOrdenProductiva, {
    onSuccess: () => {},
    onError: () => {
      addError(
        "A ocurrido un error con el calculo del precio de la orden productiva",
        "warning"
      );
    },
  }); */

  async function handleSubmit(data) {
    setSeEstaCalculandoPrecioEstimado(true);
    if (!seCalculoPrecioEstimado) {
      const { precio } = await calcularOrdenProductiva(
        data.cantidad,
        precioPrendaBase
      );
      setSeEstaCalculandoPrecioEstimado(true);
      setPrecioEstimado(precio);
      setCantidad(data.cantidad);
      setSeEstaCalculandoPrecioEstimado(false);
      setSeCalculoPrecioEstimado(true);
      return;
    } else {
      const { precio } = await calcularOrdenProductiva(
        data.cantidad,
        precioPrendaBase
      );
      setPrecioEstimado(precio);
      setCantidad(data.cantidad);
      await generarOrdenProductivaAsync({
        ...data,
        cantidad: cantidad,
        precioEstimado: precio,
      });
    }
    setSeEstaCalculandoPrecioEstimado(false);
  }

  return (
    <Dialog open={open}>
      <LoadingIndicator
        show={seEstaCalculandoPrecioEstimado || seEstaGenerandoOrdenProductiva}
      >
        <DialogTitle>Generar una produccion</DialogTitle>
        <Alert severity="info" className="mx-3">
          Especifique una cantidad y verifique el precio aproximado. En caso de
          cambiar la cantidad, cerrar y volver a presionar PEDIR UNA PRODUCCION
        </Alert>
        <HookForm defaultValues={layout} onSubmit={handleSubmit}>
          <DialogContent>
            <FormItem layout={generarOrdenProductivaLayout} />
            <p className="text-gray-500 text-xl font-semibold">
              Precio aproximado para {cantidad} unidades:{" "}
              {precioEstimado.toFixed(2)} $
            </p>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit">
              {seCalculoPrecioEstimado ? "Confirmar" : "Calcular"}
            </Button>
          </DialogActions>
        </HookForm>
      </LoadingIndicator>
    </Dialog>
  );
}
