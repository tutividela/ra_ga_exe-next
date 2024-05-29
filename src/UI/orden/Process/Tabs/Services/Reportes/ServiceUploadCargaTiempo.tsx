import FormItem from "@UI/Forms/FormItem";
import HookForm from "@UI/Forms/HookForm";
import { LayoutElement } from "@UI/Forms/types";
import { CargaDeTiempoType } from "@backend/schemas/CargaDeTiempoSchema";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";
import { ErrorHandlerContext } from "@utils/ErrorHandler/error";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { CargaDeTiempo } from "@prisma/client";
import { crearCargaDeTiempoPorIdProcesoDesarrolloOrden, actualizarCargaDeTiempoPorId, eliminarCargaDeTiempoPorId } from "@utils/queries/reportes";
import { useSession } from "next-auth/react";
import { RegistroCargaTiempo, TipoDeAccioModal } from "types/types";

type Props = {
    open: boolean;
    onClose: () => void;
    nombreProceso: string;
    idProcesoDesarrolloOrden: string;
    accion?: TipoDeAccioModal;
    cargaDeTiempo?: RegistroCargaTiempo
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

export default function ServiceUploadCargaTiempo({open, onClose, nombreProceso, idProcesoDesarrolloOrden, accion, cargaDeTiempo}: Props) {
    const {data: datosDeSesion} = useSession();
    const {addError} = useContext(ErrorHandlerContext);
    const queryClient = useQueryClient();
    const defaultLayout = accion === TipoDeAccioModal.CARGA ? {
        horas: 0,
        minutos: 0,
        comentario: '',
        idProcesoDesarrolloOrden: idProcesoDesarrolloOrden,
        email: datosDeSesion?.user?.email
    }: {
        id: cargaDeTiempo.id,
        horas: cargaDeTiempo.horas,
        minutos: cargaDeTiempo.minutos,
        comentario: cargaDeTiempo.comentario,
        idProcesoDesarrolloOrden: idProcesoDesarrolloOrden,
        email: datosDeSesion?.user?.email
    };

    const {mutateAsync: cargarTiempoAsync, isLoading: seEstaCreandoUnaCargaDeTiempo} = useMutation<CargaDeTiempo & {usuarioDeCreacion: {name: string}}, any, Partial<CargaDeTiempo>>(crearCargaDeTiempoPorIdProcesoDesarrolloOrden, {
        onError: (error) => addError(JSON.stringify(error), 'error'),
        onSuccess: () => {
            onClose();
            queryClient.invalidateQueries(['cargasDeTiempo']);
            addError("Se ha cargado el tiempo con exito!",'info');
        }
    });

    const {mutateAsync: editarTiempoAsync, isLoading: seEstaEditandoUnaCargaDeTiempo} = useMutation(actualizarCargaDeTiempoPorId, {
        onError: (error) => addError(JSON.stringify(error), 'error'),
        onSuccess: () => {
            onClose();
            queryClient.invalidateQueries(['cargasDeTiempo']);
            addError("Se ha editado el tiempo con exito!",'info');
        }
    });

    async function handleCargaDeTiempo(data: Partial<CargaDeTiempo> & {email: string}) {
        await cargarTiempoAsync(data);
    }

    async function handleEditarDeTiempo(data: Partial<CargaDeTiempo> & {email: string}) {
        await editarTiempoAsync(data);
    }

    return(  
    <Dialog open={open} onClose={onClose} fullWidth={true}>
        <DialogTitle className="self-center text-2xl m">Carga de tiempo para: {nombreProceso}</DialogTitle>
        <LoadingIndicator show={seEstaCreandoUnaCargaDeTiempo || seEstaEditandoUnaCargaDeTiempo}>
            <HookForm
                defaultValues={defaultLayout}
                onSubmit={TipoDeAccioModal.EDITAR === accion ? handleEditarDeTiempo :handleCargaDeTiempo}
            >
                <DialogContent>
                    <FormItem layout={cargaDeTiempoLayout}/>
                </DialogContent>
                <DialogActions className="flex justify-center">
                        {TipoDeAccioModal.EDITAR === accion && <Button variant="outlined" type= "submit" startIcon={<ModeEditIcon />}>Editar</Button>}
                        {TipoDeAccioModal.CARGA === accion && <Button variant="outlined" type="submit" startIcon={<AddIcon />}>Cargar</Button>}
                </DialogActions>
            </HookForm>
        </LoadingIndicator>
    </Dialog>
    );
}