import {
  ArchivoFichaTecnica,
  ContenidoFichaTencica,
  FichaTecnica,
} from "@prisma/client";
import HookForm from "@UI/Forms/HookForm";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import {
  fetchProcessStates,
  updateProcessState,
} from "@utils/queries/cotizador";
import React, { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import DialogCambioEstadoProceso from "./DialogCambioEstadoProceso";
import { Dialog, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type Process = {
  estado: string;
  proceso: string;
  icon: string;
  id: string;
  ficha: FichaTecnica & {
    archivos: ArchivoFichaTecnica[];
    contenido: ContenidoFichaTencica;
  };
  recursos: { key: string; text: string }[];
};

type Props = {
  process: Process;
  esDeProduccion: boolean;
  open: boolean;
  onClose: () => void;
  onHandleTerminarProceso: (emailRecursoNuevo?: string) => Promise<void>;
};

const OrderProcessItemChangeDialog = (props: Props) => {
  const queryClient = useQueryClient();
  const { addError } = useContext(ErrorHandlerContext);

  const { data: estadosProcesoDesarrollo } = useQuery(
    ["processStates"],
    fetchProcessStates,
    {
      initialData: [],
      onError: (err) => addError(JSON.stringify(err)),
    }
  );
  const { mutateAsync, isLoading: isUpdatingState } = useMutation(
    updateProcessState,
    {
      onSuccess: () => {
        props.onClose();
      },
      onError: () => addError("Error en la actualizacion del estado del proceso", "warning"),
    }
  );
  const states = estadosProcesoDesarrollo
    .filter(
      (estadoProcesoDesarrollo) => ![7, 8].includes(estadoProcesoDesarrollo.id)
    )
    .map((estadoProcesoDesarrollo) => ({
      key: estadoProcesoDesarrollo.descripcion,
      text: estadoProcesoDesarrollo.descripcion,
    }));
  function sePuedeHabilitarCambioEstado(
    estadoProcesoDesarrolloActual: string
  ): boolean {
    return props.process.estado === estadoProcesoDesarrolloActual;
  }
  const handleSubmit = async (data: Process) => {
    await mutateAsync({
      estado: data.estado,
      icon: data.icon,
      estimatedAt: new Date().toLocaleString(),
      id: data.id,
      proceso: data.proceso,
      esDeProduccion: props.esDeProduccion,
    });
    if (data.estado === "Terminado") {
      await props.onHandleTerminarProceso(props.process.recursos[0]?.key || "");
    }
    queryClient.invalidateQueries(["order"]);
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
        <HookForm defaultValues={props.process} onSubmit={handleSubmit}>
          <LoadingIndicator show={isUpdatingState}>
            <DialogCambioEstadoProceso
              onClose={handleClose}
              open={props.open}
              states={states}
              habilitarCambioEstado={sePuedeHabilitarCambioEstado}
            />
          </LoadingIndicator>
        </HookForm>
      </Dialog>
    </div>
  );
};

export default OrderProcessItemChangeDialog;
