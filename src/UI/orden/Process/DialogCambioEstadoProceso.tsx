import FormItem from "@UI/Forms/FormItem";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import { processItemChangeLayout } from "../forms/processItemChange.layout";
import { useFormContext } from "react-hook-form";
import { ProcesoFicha } from "../SelectableOrderProcessItem";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type Props = {
    open: boolean;
    onClose: () => void;
    states: {
        key: string;
        text: string;
    }[];
    habilitarCambioEstado: (estadoActual: string) => boolean;
}

export default function DialogCambioEstadoProceso({ open, onClose, states, habilitarCambioEstado}: Props) {
    const {watch} = useFormContext<ProcesoFicha>();
    const estadoProcesoDesarrolloActual = watch('estado');
    const habilitado = habilitarCambioEstado(estadoProcesoDesarrolloActual);

    return(
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
        >
            <div className="p-4" >
                <DialogTitle>{"Cambiar el estado para el proceso?"}</DialogTitle>
                <div className='my-4 mx-4'>
                    <FormItem layout={processItemChangeLayout} selectOptions={{states}} />
                </div>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Confirme para cambiar el estado del proceso 
                    </DialogContentText>
                </DialogContent>
                <DialogActions >
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="submit" disabled={habilitado}>Confirmar</Button>
                </DialogActions>
            </div>
    </Dialog>
    );

}