import FormItem from "@UI/Forms/FormItem";
import HookForm from "@UI/Forms/HookForm";
import { LayoutElement } from "@UI/Forms/types";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import LoadingIndicator from "@utils/LoadingIndicator/LoadingIndicator";

type Props = {
    open: boolean;
    onClose: () => void,
}

export const cargaDeTiempoLayout: LayoutElement<{horas: number, minutos: number, comentario: string}> = {
    type: 'Horizontal',
    elements: [
        {
            type: 'Input',
            label: 'Cantidad de Horas',
            scope: 'horas',
            width: 3,
            options: {
                size: 'small'
            }
        },
        {
            type: 'Input',
            label: 'Cantidad de Minutos',
            scope: 'minutos',
            width: 3,
            options: {
                size: 'small'
            }
        },
        {
            type: 'Input',
            label: 'Comentarios',
            scope: 'comentario',
            width: 12,
            options: {
                multiline: 6,
            },
        }
    ]
}

export default function ServiceUploadCargaTiempo({open, onClose}: Props) {
    return(  
    <Dialog open={open} onClose={onClose} fullWidth={true}>
        <DialogTitle>Subir carga de tiempo</DialogTitle>
        <LoadingIndicator show={false}>
            <DialogContent>
                <HookForm 
                    defaultValues={{
                        horas: 0,
                        minutos: 0,
                        comentario: ''
                    }}
                    onSubmit={() => console.log('hola')}
                >
                    <FormItem layout={cargaDeTiempoLayout} />
                </HookForm>
            </DialogContent>
        </LoadingIndicator>
    </Dialog>
    );
}