import FormItem from "@UI/Forms/FormItem";
import HookForm from "@UI/Forms/HookForm";
import { LayoutElement } from "@UI/Forms/types";
import { CargaDeTiempoType } from "@backend/schemas/CargaDeTiempoSchema";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { CargaDeTiempo } from "@prisma/client";
import { crearCargaDeTiempoPorIdProcesoDesarrolloOrden } from "@utils/queries/reportes";
import { useSession } from "next-auth/react";
import { TipoDeAccioModal } from "types/types";

type Props = {
    open: boolean;
    onClose: () => void;
    nombreProceso: string;
    idProcesoDesarrolloOrden: string;
    accion?: TipoDeAccioModal;
}

export const cargaDeTiempoLayout: LayoutElement<CargaDeTiempoType> = {
    type: 'Horizontal',
    elements: [
        {
            type: 'Input',
            label: 'Horas',
            scope: 'horas',
            className: 'mr-2 mb-2',
            width: 2,
            options: {
                size: 'small'
            }
        },
        {
            type: 'Input',
            label: 'Minutos',
            scope: 'minutos',
            className: 'mr-2 mb-2',
            width: 2,
            options: {
                size: 'small'
            }
        },
        {
            type: 'Input',
            label: 'Comentarios',
            scope: 'comentario',
            width: 10,
            options: {
                multiline: 3,
            },
        }
    ]
}

export default function ServiceUploadCargaTiempo({open, onClose, nombreProceso, idProcesoDesarrolloOrden, accion}: Props) {
    const {data: datosDeSesion} = useSession();
    const {addError} = useContext(ErrorHandlerContext);
    const queryClient = useQueryClient();
    const defaultLayout = {
        horas: 0,
        minutos: 0,
        comentario: '',
        idProcesoDesarrolloOrden: idProcesoDesarrolloOrden,
        email: datosDeSesion?.user?.email
    };

    const {mutateAsync: cargarTiempoAsync} = useMutation<CargaDeTiempo & {usuarioDeCreacion: {name: string}}, any, Partial<CargaDeTiempo>>(crearCargaDeTiempoPorIdProcesoDesarrolloOrden, {
        onError: (error) => addError(JSON.stringify(error), 'error'),
        onSuccess: () => {
            onClose();
            queryClient.invalidateQueries(['cargasDeTiempo']);
            addError("Se ha cargado el tiempo con exito!",'info');
        }
    });

    async function handleCargaDeTiempo(data: Partial<CargaDeTiempo> & {email: string}) {
        await cargarTiempoAsync(data);
    }

    return(  
    <Dialog open={open} onClose={onClose} fullWidth={true}>
        <DialogTitle className="self-center text-2xl m">Carga de tiempo para: {nombreProceso}</DialogTitle>
        <LoadingIndicator show={false}>
            <HookForm
                defaultValues={defaultLayout}
                onSubmit={handleCargaDeTiempo}
            >
                <DialogContent>
                    <FormItem layout={cargaDeTiempoLayout}/>
                </DialogContent>
                <DialogActions className="self-center">
                    <Button variant="outlined" type="submit" startIcon={<AddIcon />}>Cargar</Button>
                </DialogActions>
            </HookForm>
        </LoadingIndicator>
    </Dialog>
    );
}