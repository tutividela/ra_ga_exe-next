import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import FormItem from "@UI/Forms/FormItem";
import HookForm from "@UI/Forms/HookForm";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { OrderViewContext } from "@utils/Order/OrderViewContext";
import {
  errorHandle,
  getAllClothesPrices,
  updateOrderFields,
} from "@utils/queries/cotizador";
import React, { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { generalOrderChangelayout } from "../forms/generalOrderChange.layout";
import { EstadoOrden } from "@prisma/client";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
  open: boolean;
  onClose: () => void;
};

const OrderGeneralChangeDialog = (props: Props) => {
  const { orderData } = useContext(OrderViewContext);
  const queryClient = useQueryClient();

  const { addError } = useContext(ErrorHandlerContext);

  const fetchOrderStates = (): Promise<EstadoOrden[]> =>
    fetch(`/api/orders/states`, {})
      .then((res) => (res.ok ? res.json() : errorHandle(res)))
      .catch((error) => {
        throw error;
      });

  const { data: orderStateData, isLoading: seEstaBuscandoEstadosDeOrden } =
    useQuery(["orderStates"], () => fetchOrderStates(), {
      onError: () => addError("Error al traer estados de ordenes"),
      refetchOnWindowFocus: false,
      initialData: [],
    });

  const { data } = useQuery(["clothesPrices"], getAllClothesPrices, {
    initialData: [],
    onError: (err) => addError(JSON.stringify(err)),
  });

  const { mutateAsync, isLoading: isUpdatingState } = useMutation(
    updateOrderFields,
    {
      onSuccess: () => {
        props.onClose();
        queryClient.invalidateQueries(["order"]);
      },
      onError: (err) => addError(JSON.stringify(err)),
    }
  );

  const states = data
    .filter((el) => el.tipo.name === orderData?.prenda.tipo.name)
    .map((el) => ({ key: el.id, text: el.complejidad.name }));

  const estadosOrden = orderStateData
    .filter((estado) => ![1, 2, 6, 8].includes(estado.id))
    .map((estado) => ({ key: estado.id, text: estado.nombre }));

  const handleSubmit = async (data: { prendaID: string; idEstado: number }) => {
    await mutateAsync({
      orderId: orderData.id,
      precioPrendaId: data.prendaID,
      idEstado: data.idEstado,
    });
  };

  const handleClose = () => props.onClose();

  return (
    <div>
      <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
      >
        <LoadingIndicator
          show={isUpdatingState || seEstaBuscandoEstadosDeOrden}
        >
          <HookForm
            defaultValues={{
              prendaID: orderData.prenda.id,
              idEstado: orderData.estado.id,
            }}
            onSubmit={handleSubmit}
            resetOnDialogClose={{ dialogStatus: props.open }}
          >
            <div className="p-4">
              <DialogTitle>
                {"Editar detalles generales de la orden"}
              </DialogTitle>
              <div className="my-4 mx-4">
                <FormItem
                  layout={generalOrderChangelayout}
                  selectOptions={{ states, estadosOrden }}
                />
              </div>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  Confirmar que desea cambiar los detalles de la orden
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button type="submit">Confirmar</Button>
              </DialogActions>
            </div>
          </HookForm>
        </LoadingIndicator>
      </Dialog>
    </div>
  );
};

export default OrderGeneralChangeDialog;
